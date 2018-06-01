import {ok, serverError} from 'wix-http-functions'

import {
  createMollieSubscription,
  getMollieCustomer,
  getMollieMandates,
  getMolliePayment,
  getMollieSubscription
} from './mollie'
import {cancelSubscriptionWithSuppressAuth, setSubscription} from './database'
import {IS_PRODUCTION} from './config'

const response = {
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    log: []
  }
}

// helper function for adding debug logs
// eslint-disable-next-line no-unused-vars
function log () {
  if (!IS_PRODUCTION) {
    response.body.log.push(Object.values(arguments))
  }
}

async function apiWrapper (request, handler) {
  try {
    const {paymentId} = await parseRequestBody(request)
    const payment = await getMolliePayment(paymentId)
    response.body.result = await handler(payment)
    return ok(response)
  } catch (error) {
    response.body.error = error
    return serverError(response)
  }
}

// API endpoints
// eslint-disable-next-line camelcase
export async function post_wixPaidMembershipFirstPayment (request) {
  return apiWrapper(request, handleFirstPayment)
}

// eslint-disable-next-line camelcase
export async function post_wixPaidMembershipRecurringPayment (request) {
  return apiWrapper(request, handleRecurringPayment)
}

// helpers and handlers
async function parseRequestBody (request) {
  const body = await request.body.text() // "id=xxxx"

  return {paymentId: body.slice(3)} // return paymentId
}

async function handleFirstPayment (payment) {
  const {customerId} = payment
  const [customer, {_embedded: {mandates}}] = await Promise.all([await getMollieCustomer(customerId), await getMollieMandates(customerId)])
  const mandate = mandates[0] // TODO [mollie] how do you know which mandate will be used for which description?

  const {wixSubscriberId} = JSON.parse(customer.metadata)

  if (mandate && mandate.status === 'valid' && payment.status === 'paid') {
    // TODO add check if subscription already exists
    const subscription = await createMollieSubscription(customerId)
    await setSubscription(wixSubscriberId, subscription.id)
  } else {
    throw new Error(`the mandate status was ${mandate ? mandate.status : 'not defined'} and the payment status was ${payment.status}, so subscription was not granted.`)
  }
}

async function handleRecurringPayment ({customerId, subscriptionId, status}) {
  const subscription = await getMollieSubscription(customerId, subscriptionId)

  const customer = await getMollieCustomer(customerId)
  const {wixSubscriberId} = JSON.parse(customer.metadata)

  if (!subscription || subscription.status !== 'active' || status !== 'paid') {
    await cancelSubscriptionWithSuppressAuth(wixSubscriberId)
  }
}
