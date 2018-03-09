import wixData from 'wix-data';

export const SUBSCRIBERS_COLLECTION_NAME = 'Subscribers';

export async function getSubscriberByUserId(userId) {
  const subscriberDataQuery = await wixData.query(SUBSCRIBERS_COLLECTION_NAME).eq('userId', userId).find();
  return subscriberDataQuery.items[0];
}

export async function addSubscriber(userId) {
  return await wixData.insert(SUBSCRIBERS_COLLECTION_NAME, {userId, isSubscribed: false});
}

export async function updateSubscriber(subscriber) {
  return await wixData.update(SUBSCRIBERS_COLLECTION_NAME, subscriber);
}

export async function grantSubscription(subscriberId, mollieSubscriptionId) {
  const subscriber = await wixData.get(SUBSCRIBERS_COLLECTION_NAME, subscriberId, {suppressAuth: true});  // this code will be called by mollie webhook which will have 'visitor' rights, so we need to bypass auth to read/write to this collection
  subscriber.isSubscribed = true;
  subscriber.mollieSubscriptionId = mollieSubscriptionId;
  subscriber.amountOfPayments = subscriber.amountOfPayments ? subscriber.amountOfPayments + 1 : 1;
  return await wixData.update(SUBSCRIBERS_COLLECTION_NAME, subscriber, {suppressAuth: true});
}
