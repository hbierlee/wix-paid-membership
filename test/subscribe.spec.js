import chai from 'chai';
import {testSubscriber} from 'wix-data';

chai.use(require('chai-as-promised'));


const {subscribe} = require('../backend/subscribe');

describe('subscribe functionality', function () {

  it('should create a subscriber in the database and return a payment', async function () {
    process.env.CUSTOMER_EXISTS = 'false';
    const result = await subscribe('henk', 'bierlee.henk@gmail.com');
    chai.expect(result).to.exist;
    chai.expect(result.error).to.equal(undefined);
    chai.expect(process.env.CUSTOMER_EXISTS).to.equal('true');
  });

  it('should throw an error if the subscriber already has a subscription', function () {
    process.env.CUSTOMER_EXISTS = 'true';
    testSubscriber.isSubscribed = true;
    return chai.expect(subscribe(testSubscriber.userId, testSubscriber.email)).to.be.rejectedWith('The user with userId some-user-id is already subscribed');
  });
});
