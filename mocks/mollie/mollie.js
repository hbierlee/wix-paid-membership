const customers = []
const payments = []
const subscriptions = []

let customerIdCounter = 0
let paymentIdCounter = 0
let subscriptionIdCounter = 0

export function resetMockedMollieDb () {
  customers.length = 0
  payments.length = 0
  subscriptions.length = 0

  customerIdCounter = 0
  paymentIdCounter = 0
  subscriptionIdCounter = 0
}

export async function createMollieCustomer (name, email, wixSubscriberId) {
  console.log('mock createMollieCustomer')
  const customer = {name, email, metadata: JSON.stringify({wixSubscriberId}), id: `customer_${customerIdCounter++}`}
  customers.push(customer)
  return customer
}

export async function getMollieCustomer (customerId) {
  console.log('mock getMollieCustomer')
  return customers.find(c => c.id === customerId)
}

export async function createFirstMolliePayment (customerId) {
  console.log('mock createFirstMolliePayment')
  const payment = {customerId, id: `payment_${paymentIdCounter++}`, _links: {checkout: {href: 'checkout_href'}}, status: 'paid'}
  payments.push(payment)
  return payment
}

export async function getMollieMandates (customerId) {
  console.log('mock getMollieMandates')
  return {_embedded: {mandates: [{status: 'valid', customerId}]}}
}

export async function createMollieSubscription (customerId) {
  console.log('mock createMollieSubscription')
  const subscriptionId = `subscription_${subscriptionIdCounter++}`
  const subscription = {customerId, status: 'active', id: subscriptionId}
  subscriptions.push(subscription)

  const subscriptionPayment = {customerId, id: `payment_${paymentIdCounter++}`, _links: {checkout: {href: 'checkout_href'}}, status: 'paid', subscriptionId}
  payments.push(subscriptionPayment)

  return subscription
}

export async function getMollieSubscription (customerId, subscriptionId) {
  console.log('mock getMollieSubscription')
  return subscriptions.find(s => s.id === subscriptionId)
}

export async function cancelMollieSubscription (customerId, subscriptionId) {
  console.log('mock cancelMollieSubscription')
  const subscription = subscriptions.find(s => s.customerId === customerId && s.id === subscriptionId)
  if (subscription) {
    subscription.status = 'canceled'
  }
}

export async function getMolliePayment (paymentId) {
  console.log('mock getMolliePayment')
  return payments.find(p => p.id === paymentId)
}

export async function listMolliePayments (customerId) {
  console.log('mock listMolliePayments')
  const paymentsForCustomer = payments.filter(p => p.customerId === customerId)
  return {_embedded: {payments: paymentsForCustomer}, count: paymentsForCustomer.length}
}
