import prompt from 'prompt';
import {testSubscriber} from 'wix-data';

import {post_firstPayment, post_recurringPayment} from '../src/http-functions';
import {createFirstPayment, createMollieCustomer} from '../src/mollie';


describe('webhook', function () {

  let customer;
  let payment;

  beforeEach(async function () {
    process.env.CUSTOMER_EXISTS = 'true';
    customer = await createMollieCustomer(testSubscriber.title, testSubscriber.email, testSubscriber._id);
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
