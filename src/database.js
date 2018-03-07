import wixData from 'wix-data';

export const SUBSCRIBERS_COLLECTION_NAME = 'Subscribers';

export async function getSubscriberByUserId(userId) {
  const subscriberDataQuery = await wixData.query(SUBSCRIBERS_COLLECTION_NAME).eq('title', userId).find();
  return subscriberDataQuery.items[0];
}

export async function addSubscriber(userId, email) {
  return await wixData.insert(SUBSCRIBERS_COLLECTION_NAME, {title: userId, email, isSubscribed: false});
}

export async function updateSubscriber(subscriber) {
  return await wixData.update(SUBSCRIBERS_COLLECTION_NAME, subscriber);
}
