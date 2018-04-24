import {fetch} from 'wix-fetch';

import {
  FIRST_PAYMENT_AMOUNT,
  FIRST_PAYMENT_DESCRIPTION,
  FIRST_PAYMENT_WEBHOOK,
  MOLLIE_API_KEY,
  PREMIUM_PAGE_ROUTER_PREFIX,
  SITE_URL,
  SUBSCRIPTION_AMOUNT,
  SUBSCRIPTION_DESCRIPTION,
  SUBSCRIPTION_INTERVAL,
} from './config';

/**
 *
 * @param path endpoint path + query parameters
 * @param method
 * @param [data] body data fields in case of POST request
 * @returns {Promise<*>}
 */
async function mollieApiWrapper(path, method, data) {
  const response = await fetch(`https://api.mollie.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${MOLLIE_API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (json.error) {
    throw new Error(`Error in mollie API call:\n${JSON.stringify(json.error, null, 2)}`);
  } else {
    return json;
  }
}

export async function createMollieCustomer(name, email, wixSubscriberId) {
  return await mollieApiWrapper('customers', 'POST', {name, email, metadata: JSON.stringify({wixSubscriberId})});
}

export async function getMollieCustomer(customerId) {
  return await mollieApiWrapper(`customers/${customerId}`, 'GET');
}

export async function createFirstMolliePayment(customerId) {
  return await mollieApiWrapper('payments', 'POST', {
    customerId,
    amount: FIRST_PAYMENT_AMOUNT,
    description: FIRST_PAYMENT_DESCRIPTION,
    redirectUrl: `${SITE_URL}/${PREMIUM_PAGE_ROUTER_PREFIX}`,
    recurringType: 'first',
    webhookUrl: FIRST_PAYMENT_WEBHOOK,
  });
}

export async function getMollieMandates(customerId) {
  return await mollieApiWrapper(`customers/${customerId}/mandates`, 'GET');
}

export async function createMollieSubscription(customerId) {
  return await mollieApiWrapper(`customers/${customerId}/subscriptions`, 'POST', {
    amount: SUBSCRIPTION_AMOUNT,
    interval: SUBSCRIPTION_INTERVAL,
    description: SUBSCRIPTION_DESCRIPTION,
  });
}

export async function getMollieSubscription(customerId, subscriptionId) {
  return await mollieApiWrapper(`customers/${customerId}/subscriptions/${subscriptionId}`, 'GET');
}

export async function cancelMollieSubscription(customerId, subscriptionId) {
  return await mollieApiWrapper(`customers/${customerId}/subscriptions/${subscriptionId}`, 'DELETE');
}

export async function getMolliePayment(paymentId) {
  return await mollieApiWrapper(`payments/${paymentId}`, 'GET');
}
