import {ok, serverError} from 'wix-http-functions';

import {createSubscription, getCustomer, getMandates, getPayment} from './mollie';
import {grantSubscription} from './database';
import {IS_PRODUCTION, SITE_URL} from './config';

export const SITE_API_URL = `${SITE_URL}/_functions`;

const response = {
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    log: [],
  },
};

// helper function for adding debug logs
function log() {
  if (!IS_PRODUCTION) {
    response.body.log.push(Object.values(arguments));
  }
}

async function apiWrapper(request, handler) {
  try {
    response.body.result = await handler(request);
    return ok(response);
  } catch (error) {
    response.body.error = error;
    return serverError(response);
  }
}

export async function post_firstPayment(request) {
  return await apiWrapper(request, handleFirstPayment);
}

export async function handleFirstPayment(request) {
  const body = await request.body.text(); // "id=xxxx"
  const paymentId = body.slice(3);

  const payment = await getPayment(paymentId);
  const {customerId} = payment;
  const [customer, mandates] = await Promise.all([await getCustomer(customerId), await getMandates(customerId)]);
  const mandate = mandates.data[0];

  const {subscriberId} = JSON.parse(customer.metadata);

  if (mandate && mandate.status === 'valid' && payment.status === 'paid') {
    const subscription = await createSubscription(customerId);
    if (subscription.error) {
      throw subscription.error;
    }
    await grantSubscription(subscriberId, subscription.id);
  } else {
    throw `the mandate status was ${mandate ? mandate.status : 'not defined'} and the payment status was ${payment.status}, so subscription was not granted.`;
  }
}
