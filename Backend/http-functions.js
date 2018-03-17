import {ok, serverError} from 'wix-http-functions';

import {createSubscription, getCustomer, getMandates, getPayment} from './mollie';
import {cancelSubscription, grantSubscription} from './database';
import {IS_PRODUCTION} from './config';

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

// API endpoints
export async function post_firstPayment(request) {
  return await apiWrapper(request, handleFirstPayment);
}

export async function post_recurringPayment(request) {
  return await apiWrapper(request, handleRecurringPayment);
}

// helpers and handlers
async function parseRequestBody(request) {
  const body = await request.body.text(); // "id=xxxx"

  return body.slice(3); // return paymentId
}

export async function handleFirstPayment(request) {
  const paymentId = await parseRequestBody(request);

  const payment = await getPayment(paymentId);
  const {customerId} = payment;
  const [customer, mandates] = await Promise.all([await getCustomer(customerId), await getMandates(customerId)]);
  const mandate = mandates.data[0]; // TODO [mollie] should I check for more mandates?

  const {wixSubscriberId} = JSON.parse(customer.metadata);

  if (mandate && mandate.status === 'valid' && payment.status === 'paid') {
    // TODO add check if subscription already exists
    const subscription = await createSubscription(customerId);
    if (subscription.error) {
      throw subscription.error;
    }
    await grantSubscription(wixSubscriberId, subscription.id);
  } else {
    throw `the mandate status was ${mandate ? mandate.status : 'not defined'} and the payment status was ${payment.status}, so subscription was not granted.`;
  }
}

export async function handleRecurringPayment(request) {
  const paymentId = await parseRequestBody(request);
  const payment = await getPayment(paymentId);

  // TODO [mollie] should I check if the mandates are still valid?
  // payment status is either 'cancelled', 'expired', 'failed', 'paid', 'refunded', 'charged_back'
  if (payment.status !== 'paid') {  // unsubscribe user in all cases except 'paid'
    const customer = await getCustomer(payment.customerId);
    const {wixSubscriberId} = JSON.parse(customer.metadata);
    await cancelSubscription(wixSubscriberId);
  }
}
