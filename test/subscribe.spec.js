import chai from 'chai';
import {db} from 'wix-data';

import {subscribe} from '../backend/subscribe';
import {getCustomer} from '../Backend/mollie';

chai.use(require('chai-as-promised'));

describe('subscribe functionality', function () {

  const userId = 'someMemberUserId';
  const email = 'someMemberEmail@email.com';

  it('should create a subscriber in the database and a customer on the Mollie platform, and return a payment with paymentUrl and paymentId', async function () {
    const result = await subscribe(userId, email);

    // verify payment result
    chai.expect(result).to.exist;
    chai.expect(result.paymentUrl).to.exist;
    chai.expect(result.paymentId).to.exist;
    chai.expect(result.error).to.not.exist;

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
    await subscribe(userId, email);
    db[0].isSubscribed = true;
    return chai.expect(subscribe(userId, email)).to.be.rejectedWith(`The user with userId ${userId} is already subscribed`);
  });
});
