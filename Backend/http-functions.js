import {ok, serverError} from 'wix-http-functions';

import {
  createMollieSubscription,
  getMollieCustomer,
  getMollieMandates,
  getMolliePayment,
  getMollieSubscription,
} from './mollie';
import {cancelSubscriptionWithSuppressAuth, setSubscription} from './database';
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
    const {paymentId} = await parseRequestBody(request);
    const payment = await getMolliePayment(paymentId);
    response.body.result = await handler(payment);
    return ok(response);
  } catch (error) {
    response.body.error = error;
    return serverError(response);
  }
}

// API endpoints
export async function post_wixPaidMembershipFirstPayment(request) {
  return await apiWrapper(request, handleFirstPayment);
}

export async function post_wixPaidMembershipRecurringPayment(request) {
  return await apiWrapper(request, handleRecurringPayment);
}

// helpers and handlers
async function parseRequestBody(request) {
  const body = await request.body.text(); // "id=xxxx"

  return {paymentId: body.slice(3)}; // return paymentId
}

async function handleFirstPayment(payment) {
  const {customerId} = payment;
  const [customer, mandates] = await Promise.all([await getMollieCustomer(customerId), await getMollieMandates(customerId)]);
  const mandate = mandates.data[0]; // TODO [mollie] how do you know which mandate will be used for which description?

  const {wixSubscriberId} = JSON.parse(customer.metadata);

  if (mandate && mandate.status === 'valid' && payment.status === 'paid') {
    // TODO add check if subscription already exists
    const subscription = await createMollieSubscription(customerId);
    await setSubscription(wixSubscriberId, subscription.id);
  } else {
    throw `the mandate status was ${mandate ? mandate.status : 'not defined'} and the payment status was ${payment.status}, so subscription was not granted.`;
  }
}

// TODO fix the unit test so that this handler doesn't have to be exported
export async function handleRecurringPayment({customerId, subscriptionId}) {
  const subscription = await getMollieSubscription(customerId, subscriptionId);

  // TODO [mollie] or is it better to check for payment !== 'paid' instead of subscription status?
  const customer = await getMollieCustomer(customerId);
  const {wixSubscriberId} = JSON.parse(customer.metadata);

  if (subscription.status === 'active') {
    await setSubscription(wixSubscriberId, subscriptionId);
  } else {
    await cancelSubscriptionWithSuppressAuth(wixSubscriberId);
  }
}
