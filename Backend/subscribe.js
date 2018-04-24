import {
  cancelMollieSubscription,
  createFirstMolliePayment,
  createMollieCustomer,
  getMollieSubscription,
} from './mollie';
import {createSubscriber, getSubscriberByUserId, updateSubscriber} from './database';

async function createSubscriberAndMollieCustomer(userId, email) {
  const subscriber = await createSubscriber(userId, email);
  const customer = await createMollieCustomer(userId, email, subscriber._id); // TODO could improve this name to be firstName + lastName if present

  subscriber.mollieCustomerId = customer.id;
  return await updateSubscriber(subscriber);
}

export async function subscribe(userId, email) {
  const subscriber = await getSubscriberByUserId(userId) || await createSubscriberAndMollieCustomer(userId, email);

  if (await getSubscriptionStatus(userId) === 'active') {
    throw new Error(`The user with userId ${userId} is already subscribed.`);
  } else {  // create first payment to create new subscription
    const payment = await createFirstMolliePayment(subscriber.mollieCustomerId);
    return {paymentUrl: payment.links.paymentUrl, paymentId: payment.id, mollieCustomerId: subscriber.mollieCustomerId};
  }
}

export async function getSubscriptionStatus(userId) {
  const subscription = await getMollieSubscriptionByUserId(userId);
  return subscription ? subscription.status : 'none';
}

export async function getMollieSubscriptionByUserId(userId) {
  const subscriber = await getSubscriberByUserId(userId);
  if (!subscriber || !subscriber.mollieSubscriptionId) {
    return undefined;
  }

  try {
    return await getMollieSubscription(subscriber.mollieCustomerId, subscriber.mollieSubscriptionId);
  } catch (e) { // subscription is non-existent or cancelled
    return undefined;
  }
}

export async function unsubscribe(userId) {
  const subscription = await getMollieSubscriptionByUserId(userId);
  if (subscription) {
    await cancelMollieSubscription(subscription.customerId, subscription.id);
  }
}
