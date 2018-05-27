import {fetch} from 'wix-fetch'

import {
  CURRENCY,
  FIRST_PAYMENT_AMOUNT,
  FIRST_PAYMENT_DESCRIPTION,
  MOLLIE_API_KEY,
  PREMIUM_PAGE_ROUTER_PREFIX,
  SITE_API_URL,
  SITE_URL,
  SUBSCRIPTION_AMOUNT,
  SUBSCRIPTION_DESCRIPTION,
  SUBSCRIPTION_INTERVAL
} from './config'

/**
 *
 * @param path endpoint path + query parameters
 * @param method
 * @param [data] body data fields in case of POST request
 * @returns {Promise<*>}
 */
export async function mollieApiWrapper (path, method, data) {
  const response = await fetch(`https://api.mollie.com/v2/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${MOLLIE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const json = await response.json()

  if (response.ok) {
    return json
  } else {
    return Promise.reject(json)
    // throw new Error(`Error in mollie API call:\n${JSON.stringify(json.error, null, 2)}`);
    // return json;
  }
}

export async function createMollieCustomer (name, email, wixSubscriberId) {
  return mollieApiWrapper('customers', 'POST', {name, email, metadata: JSON.stringify({wixSubscriberId})})
}

export async function getMollieCustomer (customerId) {
  return mollieApiWrapper(`customers/${customerId}`, 'GET')
}

export async function createFirstMolliePayment (customerId) {
  return mollieApiWrapper('payments', 'POST', {
    customerId,
    amount: {
      value: FIRST_PAYMENT_AMOUNT,
      currency: CURRENCY
    },
    description: FIRST_PAYMENT_DESCRIPTION,
    redirectUrl: `${SITE_URL}/${PREMIUM_PAGE_ROUTER_PREFIX}`,
    sequenceType: 'first',
    webhookUrl: `${SITE_API_URL}/wixPaidMembershipFirstPayment`
  })
}

export async function getMollieMandates (customerId) {
  return mollieApiWrapper(`customers/${customerId}/mandates`, 'GET')
}

export async function createMollieSubscription (customerId) {
  return mollieApiWrapper(`customers/${customerId}/subscriptions`, 'POST', {
    amount: {
      value: SUBSCRIPTION_AMOUNT,
      currency: CURRENCY
    },
    interval: SUBSCRIPTION_INTERVAL,
    description: SUBSCRIPTION_DESCRIPTION,
    webhookUrl: `${SITE_API_URL}/wixPaidMembershipRecurringPayment`
  })
}

export async function getMollieSubscription (customerId, subscriptionId) {
  return mollieApiWrapper(`customers/${customerId}/subscriptions/${subscriptionId}`, 'GET')
}

export async function cancelMollieSubscription (customerId, subscriptionId) {
  return mollieApiWrapper(`customers/${customerId}/subscriptions/${subscriptionId}`, 'DELETE')
}

export async function getMolliePayment (paymentId) {
  return mollieApiWrapper(`payments/${paymentId}`, 'GET')
}
