import mock from 'mock-require';
import {testSubscriber} from 'wix-data';


import {post_payments} from './http-functions';
import {createFirstPayment, createMollieCustomer} from './mollie';

describe('webhook', function () {

  let customer;
  let payment;

  beforeEach(async function() {
    customer = await createMollieCustomer(testSubscriber.title, testSubscriber.email);
    payment = await createFirstPayment(customer.id);
  });
  it('should work', async function () {
    console.log('c', customer);
    console.log('p', payment);
    return post_payments({body: {id: payment.id}});
  });
});
