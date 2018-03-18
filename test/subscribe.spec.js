import chai from 'chai';
import {db} from 'wix-data';

import opn from 'opn';
import {createTunneledServer, waitForWebhookToSettle} from './tunneledServer';
import {getSubscriptionStatus, subscribe} from '../Backend/subscribe';
import {getCustomer} from '../Backend/mollie';
import {remove} from '../mocks/wix-data';

chai.use(require('chai-as-promised'));

describe('subscriptions', function () {

  let userId = 'someMemberUserId';
  let email = 'someMemberEmail@email.com';
  let subscribeResult;

  before(async function () {
    console.log('a');
    await createTunneledServer();
  });

  beforeEach(async function () {
    subscribeResult = await subscribe(userId, email);
  });

  afterEach(function () {
    remove(); // clear db
  });

  describe('subscribe functionality', function () {

    beforeEach(async function () {
      await opn(subscribeResult.paymentUrl);
      await waitForWebhookToSettle();
    });

    it('should create a subscriber in the database and a customer on the Mollie platform, and return a payment with paymentUrl and paymentId', async function () {

      // verify payment result
      chai.expect(subscribeResult).to.exist;
      chai.expect(subscribeResult.paymentUrl).to.exist;
      chai.expect(subscribeResult.paymentId).to.exist;
      chai.expect(subscribeResult.error).to.not.exist;

      // verify db subscriber
      const [subscriber] = db;
      chai.expect(subscriber.userId).to.equal(userId);
      chai.expect(!subscriber.isSubscribed);  // subscriber is not yet subscriber, because we haven't paid the payment yet

      // verify mollie customer
      const customer = await getCustomer(subscriber.mollieCustomerId);
      chai.expect(customer.id).to.equal(subscriber.mollieCustomerId);
      chai.expect(customer.name).to.equal(userId);
      chai.expect(customer.email).to.equal(email);
      chai.expect(JSON.parse(customer.metadata)).to.deep.equal({wixSubscriberId: 'id-0'});
    });

    it('should throw an error if the subscriber already has a subscription', async function () {
      db[0].isSubscribed = true;
      return chai.expect(subscribe(userId, email)).to.be.rejectedWith(`The user with userId ${userId} is already subscribed`);
    });
  });

  describe('get subscription status functionality', function () {

    it('should return subscription status', async function () {
      const subscriptionStatusA = await getSubscriptionStatus(userId);
      chai.expect(!!subscriptionStatusA.isSubscribed).to.equal(false);
      chai.expect(subscriptionStatusA.subscription).to.equal(undefined);

      console.log('accept the first payment by selecting status \'paid\' at the following URL: ' + subscribeResult.paymentUrl);
      await opn(subscribeResult.paymentUrl);
      await waitForWebhookToSettle();

      const subscriptionStatusB = await getSubscriptionStatus(userId);
      console.log(subscriptionStatusB);
      chai.expect(!!subscriptionStatusB.isSubscribed).to.equal(true);
      chai.expect(subscriptionStatusB.subscription).to.exist;

    });
  });

});

