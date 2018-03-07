import prompt from 'prompt';
import {testSubscriber} from 'wix-data';

import {post_firstPayment, post_recurringPayment} from './http-functions';
import {createFirstPayment, createMollieCustomer} from './mollie';

describe('webhook', function () {

  let customer;
  let payment;

  beforeEach(async function () {
    customer = await createMollieCustomer(testSubscriber.title, testSubscriber.email);
    payment = await createFirstPayment(customer.id);
    console.log('paymentId', payment.id);

  });

  it('should process a payment and (if succesfull) subscribe the customer', async function (done) {
    console.log('waiting on accepting payment on');
    console.log(payment.links.paymentUrl);
    prompt.start();
    prompt.get(['placeholder'], function (err, result) {
      console.log('continue');
      return post_firstPayment({body: {id: payment.id}});
      done();
    });
  });

  xit('should process a failed recurring payment and unsubscribe the customer', async function () {


  });
});
