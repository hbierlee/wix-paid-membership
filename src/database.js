import wixData from 'wix-data';

const COLLECTION_NAME = 'Subscribers';

export async function getSubscriber(userId) {
  const subscriberDataQuery = await wixData.query(COLLECTION_NAME).eq('title', userId).find();
  return subscriberDataQuery.items[0];
}

export async function addSubscriber(userId, email) {
  return await wixData.insert(COLLECTION_NAME, {title: userId, email, isSubscribed: false});
}
