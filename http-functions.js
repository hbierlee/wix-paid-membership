import {fetch} from 'wix-fetch';
import {ok, notFound, serverError} from 'wix-http-functions';

import {createSubscription, getMandates, getPayment} from './mollie';
import {updateSubscriber} from './database';


const SITE_API_URL = 'https://bierleehenk.wixsite.com/henk-bierlee/_functions-dev'; // TODO change to production

export const firstPaymentWebhookUrl = `${SITE_API_URL}/firstPayment`;

export async function post_firstPayment(request) {
  console.log('firstPayment webhook');
  const payment = await getPayment(request.body.id);

  if (payment.status === 'paid') {
    const mandates = await getMandates(payment.customerId);
    const mandate = mandates.data[0];
    console.log('m', mandate);

    if (mandate.status === 'valid') {
      const subscription = await createSubscription(payment.customerId);

      const subscriptionId = subscription.id;

      console.log('s', subscription);
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
    return ok({a: 'b'});
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