const customers = []
const payments = []
const subscriptions = []

let customerIdCounter = 0
let paymentIdCounter = 0
let subscriptionIdCounter = 0

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
  const subscription = {customerId, status: 'active', id: `subscription_${subscriptionIdCounter++}`}
  subscriptions.push(subscription)
  return subscription
}

export async function getMollieSubscription (customerId, subscriptionId) {
  console.log('mock getMollieSubscription')
  return subscriptions.find(s => s.id === subscriptionId)
}

export async function cancelMollieSubscription (customerId, subscriptionId) {
  console.log('mock cancelMollieSubscription')
  delete subscriptions[subscriptions.indexOf(s => s.id === subscriptionId)]
}

export async function getMolliePayment (paymentId) {
  console.log('mock getMolliePayment')
  return payments.find(p => p.id === paymentId)
}
