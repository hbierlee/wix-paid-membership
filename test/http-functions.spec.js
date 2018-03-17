import chai from 'chai';

import prompt from 'prompt';
import {get} from 'wix-data';

import {handleFirstPayment} from '../backend/http-functions';
import {handleRecurringPayment, SITE_API_URL} from '../Backend/http-functions';
import {fetch} from '../mocks/wix-fetch';
import {SUBSCRIPTION_AMOUNT} from '../Backend/config';
import {subscribe} from '../Backend/subscribe';
import {db} from '../mocks/wix-data';
import {createPayment} from '../Backend/mollie';

const config = require('../Backend/config');

chai.use(require('chai-as-promised'));

const userName = 'memberUserName';
const email = 'memberEmail@email.com';

async function waitOnUserInput() {
  return await new Promise((resolve, reject) => {
    prompt.start();
    prompt.get(['press return once test payment is accepted with some status'], (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve();
      }
    });
  });
}

function mockMollieRequestToWebhook(paymentId) {
  return {body: {text: () => `id=${paymentId}`}}
}

describe('webhook', function () {

  it('should process a payment and (if successful) subscribe the customer. Then, it should unsubscribe the user if the following recurring payment is unsuccessful', async function () {
    config['FIRST_PAYMENT_WEBHOOK'] = '';  // disable this webhook so we can call it manually

    // subscribe a new user, and let the use accept the 'first' payment
    const firstPayment = await subscribe(userName, email);
    console.log('accept the first payment by selecting status \'paid\' at the following URL:');
    console.log(firstPayment.paymentUrl);
    await waitOnUserInput();

    // handle first payment webhook request
    await handleFirstPayment(mockMollieRequestToWebhook(firstPayment.paymentId));

    chai.expect(db[0].isSubscribed).to.equal(true);

    // create the recurring payment and let the user fail the recurring payment
    const recurringPayment = await createPayment(db[0].mollieCustomerId);
    console.log('fail the second payment by selecting \'expired\', \'failed\' or \'cancelled\' at the following URL:');
    console.log(recurringPayment.links.paymentUrl);
    await waitOnUserInput();

    // handle recurring payment webhook request
    await handleRecurringPayment(mockMollieRequestToWebhook(recurringPayment.id));
    chai.expect(db[0].isSubscribed).to.equal(false);
  });
});
