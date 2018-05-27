import {createFirstMolliePayment, createMollieCustomer} from './mollie'
import {cancelSubscription, createSubscriber, getSubscriberByUserId, updateSubscriber} from './database'

async function createSubscriberAndMollieCustomer (userId, email) {
  const subscriber = await createSubscriber(userId, email)
  const customer = await createMollieCustomer(userId, email, subscriber._id) // TODO could improve this name to be firstName + lastName if present

  subscriber.mollieCustomerId = customer.id
  return await updateSubscriber(subscriber)
}

export async function subscribe (userId, email) {
  const subscriber = await getSubscriberByUserId(userId) || await createSubscriberAndMollieCustomer(userId, email)

  if (await hasActiveSubscription(userId)) {
    throw new Error(`The user with userId ${userId} is already subscribed.`)
  } else { // create first payment to create new subscription
    const payment = await createFirstMolliePayment(subscriber.mollieCustomerId)
    return {paymentUrl: payment._links.checkout.href, paymentId: payment.id, mollieCustomerId: subscriber.mollieCustomerId}
  }
}

export async function hasActiveSubscription (userId) {
  const subscriber = await getSubscriberByUserId(userId)
  return subscriber && subscriber.hasActiveSubscription
}

export async function unsubscribe (userId) {
  const subscriber = await getSubscriberByUserId(userId)
  if (subscriber) {
    await cancelSubscription(userId) // database hook takes care of DELETE call to cancel Mollie subscription
  }
}
