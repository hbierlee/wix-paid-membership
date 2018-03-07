import {fetch} from 'wix-fetch';
import wixData from 'wix-data';
import {ok, notFound, serverError} from 'wix-http-functions';

import {createSubscription, getCustomer, getMandates, getPayment} from './mollie';
import {getSubscriberByUserId, SUBSCRIBERS_COLLECTION_NAME, updateSubscriber} from './database';


const SITE_API_URL = 'https://bierleehenk.wixsite.com/henk-bierlee/_functions-dev'; // TODO change to production

export const firstPaymentWebhookUrl = `${SITE_API_URL}/firstPayment`;

export async function post_firstPayment(request) {
  console.log('firstPayment webhook');
  const payment = await getPayment(request.body.id);
  const {customerId} = payment;
  const customer = await getCustomer(customerId);
  const {subscriberId} = JSON.parse(customer.metadata);
  console.log('c', customer);
  console.log('subscriberId', subscriberId);

  if (payment.status === 'paid') {
    const mandates = await getMandates(customerId);
    const mandate = mandates.data[0];
    console.log('m', mandate);

    if (mandate.status === 'valid') {
      const subscription = await createSubscription(customerId);
      const subscriptionId = subscription.id;

      const subscriber = await wixData.get(SUBSCRIBERS_COLLECTION_NAME, subscriberId);
      subscriber.isSubscribed = true;
      subscriber.subscriptionId = subscriptionId;
      subscriber.amountOfPayments = 1;
      const update = await wixData.update(SUBSCRIBERS_COLLECTION_NAME, subscriber);
      console.log('u', update);
      return ok();

      // createdDatetime: '2018-03-07T14:01:09.0Z' }
    // s { resource: 'subscription',
    //   id: 'sub_eaSnBtT6MN',
    //   customerId: 'cst_hME9sMmRhz',
    //   mode: 'test',
    //   createdDatetime: '2018-03-07T14:01:15.0Z',
    //   status: 'active',
    //   amount: '0.01',
    //   description: 'Monthly subscription payment',
    //   method: null,
    //   times: null,
    //   interval: '1 month',
    //   startDate: '2018-03-07',
    //   cancelledDatetime: null,
    //   links:
    //   { webhookUrl: 'https://bierleehenk.wixsite.com/henk-bierlee/_functions-dev/recurringPayment' } }

      // updateSubscriber(userId)
    }
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