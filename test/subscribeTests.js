import { db } from '../mocks/wix-data'
import chai from 'chai'

import { hasActiveSubscription, subscribe, unsubscribe } from '../Backend/subscribe'
import { waitForWebhookToBeCalled } from './tunneledServer'
import opn from 'opn'
import {
  cancelMollieSubscription,
  getMollieCustomer,
  getMollieSubscription,
  listMolliePayments,
  mockUserInteraction
} from '../Backend/mollie'

const userId = 'someMemberUserId'
const email = 'someMemberEmail@email.com'

export const subscribeAndResubscribeTestName = 'should create a subscriber in the database and a customer on the Mollie platform, and return a payment with paymentUrl and paymentId'

export async function testSubscribeAndResubscribe () {
  await expectSubscriptionStatusToEqual(false)
  const firstSubscribeResult = await subscribe(userId, email)
  await expectSubscriptionStatusToEqual(false)

  chai.expect(db).to.be.lengthOf(1)
  await checkSubscriberWithMollieCustomer(db[0], firstSubscribeResult)
  chai.expect(db[0].mollieSubscriptionId).to.equal(undefined)

  // should be able to re-subscribe at this point
  const secondSubscribeResult = await subscribe(userId, email)
  await expectSubscriptionStatusToEqual(false)
  chai.expect(db).to.be.lengthOf(1)
  await checkSubscriberWithMollieCustomer(db[0], secondSubscribeResult)
  chai.expect(secondSubscribeResult.mollieCustomerId).to.equal(firstSubscribeResult.mollieCustomerId)

  if (process.env.MOLLIE_IS_MOCKED) {
    await mockUserInteraction(firstSubscribeResult.paymentId, 'paid')
  } else {
    console.log('accept the first payment by selecting status \'paid\' at the following URL: ' + firstSubscribeResult.paymentUrl)
    opn(firstSubscribeResult.paymentUrl)
    await waitForWebhookToBeCalled(firstSubscribeResult.paymentId)
  }

  const firstSubscriptionId = db[0].mollieSubscriptionId
  chai.expect(firstSubscriptionId).to.be.a('string')
  await expectSubscriptionStatusToEqual(true)

  // shouldn't be able to re-subscribe while having active subscription
  try {
    await subscribe(userId, email)
    console.error('should have rejected re-subscribe promise')
    chai.assert.fail()
  } catch (e) {
    chai.expect(e.message).to.equal(`The user with userId ${userId} is already subscribed.`)
  }

  await unsubscribe(userId)
  await cancelMollieSubscription(db[0].mollieCustomerId, db[0].mollieSubscriptionId) // this is normally taking care of by the data hook!
  await expectSubscriptionStatusToEqual(false)

  // should be able to resubscribe
  const resubscribeResult = await subscribe(userId, email)
  chai.expect(db).to.be.lengthOf(1)
  await checkSubscriberWithMollieCustomer(db[0], resubscribeResult)
  chai.expect(db[0].mollieSubscriptionId).to.be.an('string')
  chai.expect(db[0].mollieSubscriptionId).to.equal(firstSubscriptionId) // expect this to not be updated yet
  await expectSubscriptionStatusToEqual(false)

  if (process.env.MOLLIE_IS_MOCKED) {
    await mockUserInteraction(resubscribeResult.paymentId, 'paid')
  } else {
    console.log('resubscribe case: accept the first payment by selecting status \'paid\' at the following URL: ' + resubscribeResult.paymentUrl)
    opn(resubscribeResult.paymentUrl)
    await waitForWebhookToBeCalled(resubscribeResult.paymentId)
  }
  await expectSubscriptionStatusToEqual(true)
  chai.expect(db[0].mollieSubscriptionId).to.be.an('string')
  chai.expect(db[0].mollieSubscriptionId).to.not.equal(firstSubscriptionId) // expect this to be updated
}

async function checkSubscriberWithMollieCustomer (subscriber, subscribeResult) {
  // verify payment result
  chai.expect(subscribeResult).to.not.equal(undefined)
  chai.expect(subscribeResult.paymentUrl).to.be.an('string')
  chai.expect(subscribeResult.paymentId).to.be.an('string')
  chai.expect(subscribeResult.error).to.equal(undefined)

  // verify db subscriber (mollieSubscriptionId is verified outside this function)
  chai.expect(subscriber.userId).to.equal(userId)
  chai.expect(subscriber.mollieCustomerId).to.equal(subscribeResult.mollieCustomerId)

  // verify mollie customer
  const customer = await getMollieCustomer(subscriber.mollieCustomerId)
  chai.expect(customer.id).to.equal(subscriber.mollieCustomerId)
  chai.expect(customer.name).to.equal(subscriber.userId)
  chai.expect(customer.email).to.equal(email)
  chai.expect(JSON.parse(customer.metadata)).to.deep.equal({wixSubscriberId: subscriber._id})
}

async function expectSubscriptionStatusToEqual (expectedStatus) {
  const subscriptionStatus = !!(await hasActiveSubscription(userId))
  chai.expect(subscriptionStatus).to.equal(expectedStatus)
}

export const recurringPaymentTestName = 'should handle recurring payment requests'
export async function testRecurringPayment () {
  const {paymentUrl, mollieCustomerId, paymentId} = await subscribe(userId, email)

  if (process.env.MOLLIE_IS_MOCKED) {
    await mockUserInteraction(paymentId, 'paid')
  } else {
    console.log('accept the first payment by selecting status \'paid\' at the following URL: ' + paymentUrl)
    opn(paymentUrl)
    await waitForWebhookToBeCalled(paymentId)
    await waitForFirstSubscriptionPayment(mollieCustomerId)
  }

  chai.expect(db[0].hasActiveSubscription).to.be.true // eslint-disable-line no-unused-expressions
}

export const failingRecurringPaymentTestName = 'should unsubscribe user if recurring payment fails'
export async function testFailingRecurringPayment () {
  const {mollieCustomerId, paymentId} = await subscribe(userId, email)

  await mockUserInteraction(paymentId, 'paid')

  const subscriptionPayment = await waitForFirstSubscriptionPayment(mollieCustomerId)
  await mockUserInteraction(subscriptionPayment.id, 'failed')

  const subscription = await getMollieSubscription(mollieCustomerId, subscriptionPayment.subscriptionId)

  chai.expect(subscription.status).to.equal('canceled') // eslint-disable-line no-unused-expressions
  chai.expect(db[0].hasActiveSubscription).to.be.false // eslint-disable-line no-unused-expressions
}

async function waitForFirstSubscriptionPayment (customerId) {
  return new Promise(async (resolve, reject) => {
    (async function checkForSubscriptionPaymentUntilFound () {
      try {
        console.log('checking')
        const {_embedded: {payments}} = await listMolliePayments(customerId)

        const subscriptionPayment = payments.find(payment => payment.subscriptionId)

        if (subscriptionPayment) {
          resolve(subscriptionPayment)
        } else {
          await setTimeout(checkForSubscriptionPaymentUntilFound, 10000) // retry in a bit
        }
      } catch (e) {
        reject(e)
      }
    })()
  })
}
