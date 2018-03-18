import {createMollieCustomer, createPayment, getCustomer, getMollieSubscriptions} from './mollie';
import {addSubscriber, getSubscriberByUserId, updateSubscriber} from './database';

async function createSubscriber(userId, email) {
  const subscriber = await addSubscriber(userId);
  const customer = await createMollieCustomer(userId, email, subscriber._id); // TODO could improve this name to be firstName + lastName if present

  subscriber.mollieCustomerId = customer.id;
  return await updateSubscriber(subscriber);
}

export async function subscribe(userId, email) {
  const subscriber = await getSubscriberByUserId(userId) || await createSubscriber(userId, email);  // should only be one at all times..

  if (subscriber.isSubscribed) {
    throw new Error(`The user with userId ${userId} is already subscribed`);
  }

  const payment = await createPayment(subscriber.mollieCustomerId, 'first');
  return {paymentUrl: payment.links.paymentUrl, paymentId: payment.id};
}

export async function getSubscriptionStatus(userId) {
  const subscriber = await getSubscriberByUserId(userId);
  const mollieSubscriptions = await getMollieSubscriptions(subscriber.mollieCustomerId);
  const [subscription] = mollieSubscriptions.data;
  console.log('m', mollieSubscriptions);


  return {
    isSubscribed: subscriber.isSubscribed,
    subscription,
  };
}

export async function unsubscribe(userId) {
  const subscriber = await getSubscriberByUserId(userId);
  const mollieSubscriptions = await getMollieSubscriptions(subscriber.mollieCustomerId);
  const [subscription] = mollieSubscriptions.data;

  // TODO ..

}
