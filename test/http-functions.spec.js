import prompt from 'prompt';
import {testSubscriber} from 'wix-data';

import {handleFirstPayment, post_recurringPayment} from '../backend/http-functions';
import {createFirstPayment, createMollieCustomer} from '../backend/mollie';


describe('webhook', function () {

  let customer;
  let payment;

  beforeEach(async function () {
    process.env.CUSTOMER_EXISTS = 'true';
    customer = await createMollieCustomer(testSubscriber.userId, testSubscriber.email, testSubscriber._id);
    payment = await createFirstPayment(customer.id, true);
    console.log('paymentId', payment.id);
  });

  it('should process a payment and (if successful) subscribe the customer', function (done) {
    console.log('waiting on accepting payment on');
    console.log(payment.links.paymentUrl);
    prompt.start();
    prompt.get(['placeholder'], function (err, result) {
      handleFirstPayment({body: {text: () => `id=${payment.id}`}})
        .then(() => {
          done()
        })
        .catch(e => {
          console.log('e', e);
          done(new Error(e));
        });
    });
  });

  xit('should process a failed recurring payment and unsubscribe the customer', async function () {
  });
});
