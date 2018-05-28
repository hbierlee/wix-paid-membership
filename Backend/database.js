import wixData from 'wix-data'

import {SUBSCRIBERS_COLLECTION_NAME} from './config'

export async function getSubscriberByUserId (userId, suppressAuth = false) {
  const subscriberDataQuery = await wixData.query(SUBSCRIBERS_COLLECTION_NAME, {suppressAuth}).eq('userId', userId).find()
  return subscriberDataQuery.items[0]
}

export async function createSubscriber (userId, email) {
  return wixData.insert(SUBSCRIBERS_COLLECTION_NAME, {userId, email})
}

// TODO I can make this update call update only the given fields (instead of the default wix-data behaviour of always overwriting the whole object). This would make setSubscription and cancelSubscriptionWithSuppressAuth better functions. Implementation note: use Object.assign, as rest operators are not supported by wix
export async function updateSubscriber (subscriber) {
  return wixData.update(SUBSCRIBERS_COLLECTION_NAME, subscriber)
}

export async function setSubscription (subscriberId, mollieSubscriptionId) {
  const subscriber = await wixData.get(SUBSCRIBERS_COLLECTION_NAME, subscriberId, {suppressAuth: true}) // this code will be called by mollie webhook which will have 'visitor' rights, so we need to bypass auth to read/write to this collection
  subscriber.mollieSubscriptionId = mollieSubscriptionId
  subscriber.hasActiveSubscription = true
  return wixData.update(SUBSCRIBERS_COLLECTION_NAME, subscriber, {suppressAuth: true})
}

export async function cancelSubscriptionWithSuppressAuth (subscriberId) {
  const subscriber = await wixData.get(SUBSCRIBERS_COLLECTION_NAME, subscriberId, {suppressAuth: true}) // this code will be called by mollie webhook which will have 'visitor' rights, so we need to bypass auth to read/write to this collection
  subscriber.hasActiveSubscription = false
  return wixData.update(SUBSCRIBERS_COLLECTION_NAME, subscriber, {suppressAuth: true}) // mollie account will be canceled via the webhook
}

export async function cancelSubscription (subscriberId) {
  const subscriber = await wixData.get(SUBSCRIBERS_COLLECTION_NAME, subscriberId)
  subscriber.hasActiveSubscription = false
  return wixData.update(SUBSCRIBERS_COLLECTION_NAME, subscriber)
}
