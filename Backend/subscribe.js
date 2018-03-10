import {createFirstPayment, createMollieCustomer} from './mollie';
import {addSubscriber, getSubscriberByUserId, updateSubscriber} from './database';

async function createSubscriber(userId, email) {
  const subscriber = await addSubscriber(userId, email);

  const customer = await createMollieCustomer(userId, email, subscriber._id);

  subscriber.mollieCustomerId = customer.id;
  return await updateSubscriber(subscriber);
}

export async function subscribe(userId, email) {
  const subscriber = await getSubscriberByUserId(userId) || await createSubscriber(userId, email);  // should only be one at all times..

  if (subscriber.isSubscribed) {
    throw new Error(`The user with userId ${userId} is already subscribed`);
  }
  // TODO maybe not make first payment when subscriber exists?
  const payment = await createFirstPayment(subscriber.mollieCustomerId);
  return payment.links.paymentUrl;
}

export async function userIsAllowedAccess({id, role}) {
  try {
    switch (role) {
      case 'Admin':
        return true;
      case 'Member': {
        return await isUserSubscribed(id);
      }
      case 'Visitor':
      default:
        return false;
    }
  } catch (e) {
    console.error('error in userIsAllowedAccess', e);
    return false;
  }
}

async function isUserSubscribed(userId) {
  const subscriber = await getSubscriberByUserId(userId);
  return subscriber && subscriber.isSubscribed;
}
