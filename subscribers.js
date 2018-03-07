import wixData from 'wix-data';

const COLLECTION_NAME = 'Subscribers';

export async function getSubscriber(userId) {
  const subscriberDataQuery = await wixData.query(COLLECTION_NAME).eq('title', userId).find();
  return subscriberDataQuery.items[0];
}

export async function addSubscriber(userId, email, mollieCustomerId) {
  return await wixData.insert(COLLECTION_NAME, {title: userId, email, mollieCustomerId, isSubscribed: false});
}

export async function updateSubscriber(userId, update) {
  const subscriber = await getSubscriber(userId);
  return await wixData.update(COLLECTION_NAME, {...subscriber, ...update});
}
