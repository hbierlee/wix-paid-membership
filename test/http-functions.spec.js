import chai from 'chai';

import prompt from 'prompt';
import {testSubscriber} from 'wix-data';

import {handleFirstPayment, post_recurringPayment} from '../backend/http-functions';
import {createFirstPayment, createMollieCustomer} from '../backend/mollie';

chai.use(require('chai-as-promised'));

async function waitOnUserInput() {
  return await new Promise((resolve, reject) => {
    prompt.start();
    prompt.get(['press return once test payment is accepted with status \'paid\''], (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve();
      }
    });
  });
}


describe('webhook', function () {

  let customer;
  let payment;

  beforeEach(async function () {
    process.env.CUSTOMER_EXISTS = 'true';
    customer = await createMollieCustomer(testSubscriber.userId, testSubscriber.email, testSubscriber._id);
    payment = await createFirstPayment(customer.id, true);
    console.log('paymentId', payment.id);
    console.log('wait on user accepting payment on the following URL:');
    console.log(payment.links.paymentUrl);
    await waitOnUserInput();
  });

  it('should process a payment and (if successful) subscribe the customer', function (done) {
    chai.expect(handleFirstPayment({body: {text: () => `id=${payment.id}`}})).to.be.fulfilled;
  });

  xit('should process a failed recurring payment and unsubscribe the customer', async function () {
  });
});
