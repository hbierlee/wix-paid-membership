import chai from 'chai';
import {db} from 'wix-data';

import opn from 'opn';
import {createTunneledServer, waitForWebhookToBeCalled} from './tunneledServer';
import {getSubscriptionStatus, subscribe, unsubscribe} from '../Backend/subscribe';
import {getMollieCustomer, mollieApiWrapper} from '../Backend/mollie';
import {remove} from '../mocks/wix-data';
import {post_recurringPayment} from '../Backend/http-functions';
import {WixHttpFunctionRequest} from '../mocks/wix-http-functions';


describe('subscriptions', function () {

  const userId = 'someMemberUserId';
  const email = 'someMemberEmail@email.com';

  before(async function () {
    await createTunneledServer();
  });

  afterEach(function () {
    remove(); // clear db
  });

  it('should create a subscriber in the database and a customer on the Mollie platform, and return a payment with paymentUrl and paymentId', async function () {
    await expectSubscriptionStatusToEqual('none');
    const firstSubscribeResult = await subscribe(userId, email);
    await expectSubscriptionStatusToEqual('none');

    //
    chai.expect(db).to.be.lengthOf(1);
    await checkSubscriberWithMollieCustomer(db[0], firstSubscribeResult);
    chai.expect(db[0].mollieSubscriptionId).to.equal(undefined);

    // should be able to re-subscribe at this point
    const secondSubscribeResult = await subscribe(userId, email);
    await expectSubscriptionStatusToEqual('none');
    chai.expect(db).to.be.lengthOf(1);
    checkSubscriberWithMollieCustomer(db[0], secondSubscribeResult);
    chai.expect(secondSubscribeResult.mollieCustomerId).to.equal(firstSubscribeResult.mollieCustomerId);

    console.log('accept the first payment by selecting status \'paid\' at the following URL: ' + firstSubscribeResult.paymentUrl);
    await opn(firstSubscribeResult.paymentUrl);
    await waitForWebhookToBeCalled();

    const firstSubscriptionId = db[0].mollieSubscriptionId;
    chai.expect(firstSubscriptionId).to.be.an('string');
    await expectSubscriptionStatusToEqual('active');

    // shouldn't be able to re-subscribe while having active subscription
    try {
      await subscribe(userId, email);
      console.error('should have rejected re-subscribe promise');
      chai.assert.fail();
    } catch (e) {
      chai.expect(e.message).to.equal(`The user with userId ${userId} is already subscribed.`);
    }

    await unsubscribe(userId);
    await expectSubscriptionStatusToEqual('none');

    // should be able to resubscribe
    const resubscribeResult = await subscribe(userId, email);
    chai.expect(db).to.be.lengthOf(1);
    await checkSubscriberWithMollieCustomer(db[0], resubscribeResult);
    chai.expect(db[0].mollieSubscriptionId).to.be.an('string');
    chai.expect(db[0].mollieSubscriptionId).to.equal(firstSubscriptionId); // expect this to not be updated yet
    await expectSubscriptionStatusToEqual('none');

    console.log('accept the first payment by selecting status \'paid\' at the following URL: ' + resubscribeResult.paymentUrl);
    await opn(resubscribeResult.paymentUrl);
    await waitForWebhookToBeCalled();
    await expectSubscriptionStatusToEqual('active');
    chai.expect(db[0].mollieSubscriptionId).to.be.an('string');
    chai.expect(db[0].mollieSubscriptionId).to.not.equal(firstSubscriptionId); // expect this to be updated
  });

  async function waitForFirstSubscriptionPayment(customerId) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          console.log('checking');
          const payments = await mollieApiWrapper(`customers/${customerId}/payments`, 'GET');

          if (payments.count === 2) {
            resolve(payments.data[0]);  // resolve with the most recent payment
            clearInterval(interval);
          }
        } catch (e) {
          reject(e);
        }
      }, 10000);
    });
  }

  /**
   * This test case might take 5-15 minutes
   */
  it('should handle recurring payment requests', async function () {
    const {paymentUrl, mollieCustomerId} = await subscribe(userId, email);
    console.log('accept the first payment by selecting status \'paid\' at the following URL: ' + paymentUrl);
    opn(paymentUrl);
    await waitForWebhookToBeCalled();
    const firstSubscriptionPayment = await waitForFirstSubscriptionPayment(mollieCustomerId);
    await post_recurringPayment(new WixHttpFunctionRequest(firstSubscriptionPayment.id));

    chai.expect(db[0].hasActiveSubscription).to.be.true;
  });

  async function checkSubscriberWithMollieCustomer(subscriber, subscribeResult) {
    // verify payment result
    chai.expect(subscribeResult).to.not.equal(undefined);
    chai.expect(subscribeResult.paymentUrl).to.be.an('string');
    chai.expect(subscribeResult.paymentId).to.be.an('string');
    chai.expect(subscribeResult.error).to.equal(undefined);

    // verify db subscriber (mollieSubscriptionId is verified outside this function)
    chai.expect(subscriber.userId).to.equal(userId);
    chai.expect(subscriber.mollieCustomerId).to.equal(subscribeResult.mollieCustomerId);

    // verify mollie customer
    const customer = await getMollieCustomer(subscriber.mollieCustomerId);
    chai.expect(customer.id).to.equal(subscriber.mollieCustomerId);
    chai.expect(customer.name).to.equal(subscriber.userId);
    chai.expect(customer.email).to.equal(email);
    chai.expect(JSON.parse(customer.metadata)).to.deep.equal({wixSubscriberId: subscriber._id});

    // verify mollie customer subscription
    const subscriptionStatus = await await getSubscriptionStatus(userId);
    chai.expect(!!subscriber.hasActiveSubscription).to.equal(subscriptionStatus && subscriptionStatus.status === 'active');
  }

  async function expectSubscriptionStatusToEqual(expectedStatus) {
    const subscriptionStatus = await getSubscriptionStatus(userId);
    chai.expect(subscriptionStatus).to.equal(expectedStatus);
  }
});
