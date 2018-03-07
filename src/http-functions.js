import {fetch} from 'wix-fetch';
import {notFound, ok, serverError, badRequest} from 'wix-http-functions';

import {createSubscription, getCustomer, getMandates, getPayment} from './mollie';
import {grantSubscription} from './database';


const SITE_API_URL = 'https://bierleehenk.wixsite.com/henk-bierlee/_functions-dev'; // TODO change to production

export const firstPaymentWebhookUrl = `${SITE_API_URL}/firstPayment`;

export async function post_firstPayment(request) {
  console.log('firstPayment webhook');
  const payment = await getPayment(request.body.id);
  const {customerId} = payment;
  const [customer, mandates] = await Promise.all([await getCustomer(customerId), await getMandates(customerId)]);
  const mandate = mandates.data[0];

  const {subscriberId} = JSON.parse(customer.metadata);

  if (mandate && mandate.status === 'valid' && payment.status === 'paid') {
    const subscription = await createSubscription(customerId);
    await grantSubscription(subscriberId, subscription.id);
    return ok();
  } else {
    return badRequest(`the mandate status was ${mandate ? mandate.status : 'not defined'} and the payment status was ${payment.status}.`);
  }
}

export const recurringPaymentWebhookUrl = `${SITE_API_URL}/recurringPayment`;

export async function post_recurringPayment(request) {
  console.log('recurringPayment webhook');
  const payment = await getPayment(request.body.id);  // maybe for future need: contains subscriptionId

  console.log('payment status', payment.status);

  // this webhook won't be called for some of these but oh well
  if (['failed', 'cancelled', 'expired', 'refunded', 'charged_back'].includes(payment.status)) { // TODO test (somehow) that this is the desired behavior
    // TODO unsubscribe
    return ok({a: 'b'});
  }
}