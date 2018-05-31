import {createFirstMolliePayment, createMollieCustomer} from './mollie'
import {cancelSubscription, createSubscriber, getSubscriberByUserId, updateSubscriber} from './database'

export async function subscribe (userId, email) {
  const subscriber = await getSubscriberByUserId(userId) || await createSubscriber(userId, email)

  if (!subscriber.mollieCustomerId) {
    const mollieCustomer = await createMollieCustomer(userId, email, subscriber._id)
    subscriber.mollieCustomerId = mollieCustomer.id
    await updateSubscriber(subscriber)
  }

  if (subscriber.hasActiveSubscription) {
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
    await cancelSubscription(subscriber._id) // database hook takes care of DELETE call to cancel Mollie subscription
  }
}
