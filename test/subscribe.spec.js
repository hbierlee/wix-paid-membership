import chai from 'chai';
import {db, testSubscriber, insert} from 'wix-data';

import {subscribe} from '../backend/subscribe';

chai.use(require('chai-as-promised'));

describe('subscribe functionality', function () {

  const userId = 'someMemberUserId';
  const email = 'someMemberEmail@email.com';

  it('should create a subscriber in the database and return a payment', async function () {
    const result = await subscribe(userId, email);

    chai.expect(result).to.exist;
    chai.expect(result.paymentUrl).to.exist;
    chai.expect(result.paymentId).to.exist;
    chai.expect(result.error).to.not.exist;

    const actualUser = db[0];
    chai.expect(actualUser.userId).to.equal(userId);
    chai.expect(!actualUser.isSubscribed);
  });

  it('should throw an error if the subscriber already has a subscription', async function () {
    await subscribe(userId, email);
    db[0].isSubscribed = true;
    return chai.expect(subscribe(userId, email)).to.be.rejectedWith(`The user with userId ${userId} is already subscribed`);
  });
});
