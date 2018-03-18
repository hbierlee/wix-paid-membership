import {fetch} from 'wix-fetch';

import {
  FIRST_PAYMENT_WEBHOOK,
  MOLLIE_API_KEY,
  PAYMENT_DESCRIPTION,
  PREMIUM_PAGE_ROUTER_PREFIX,
  RECURRING_PAYMENT_WEBHOOK,
  SITE_URL,
  SUBSCRIPTION_AMOUNT,
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

export async function getCustomer(customerId) {
  return await mollieApiWrapper(`customers/${customerId}`, 'GET');
}

/**
 * Creates payment in mollie system. Defaults to a 'first' type payment for creating the subscription.
 * @param customerId
 * @param recurringType
 * @param webhookUrl
 * @returns {Promise<void>}
 */
export async function createPayment(customerId, recurringType = 'first', webhookUrl = FIRST_PAYMENT_WEBHOOK) {
  const data = {
    customerId,
    amount: SUBSCRIPTION_AMOUNT,
    description: PAYMENT_DESCRIPTION,
    redirectUrl: `${SITE_URL}/${PREMIUM_PAGE_ROUTER_PREFIX}`,
    webhookUrl,
  };

  if (recurringType) {
    data.recurringType = recurringType;
  }

  return await mollieApiWrapper(`payments`, 'POST', data);
}

export async function getMandates(customerId) {
  return await mollieApiWrapper(`customers/${customerId}/mandates`, 'GET');
}

export async function createSubscription(customerId) {
  return await mollieApiWrapper(`customers/${customerId}/subscriptions`, 'POST', {
    amount: SUBSCRIPTION_AMOUNT,
    startDate: getSubscriptionStartDate(),
    interval: SUBSCRIPTION_INTERVAL,
    description: PAYMENT_DESCRIPTION,
    webhookUrl: RECURRING_PAYMENT_WEBHOOK,
  });
}


export async function getMollieSubscriptions(customerId) {
  return await mollieApiWrapper(`customers/${customerId}/subscriptions`, 'GET');
}

export async function getMollieSubscription(customerId, subscriptionId) {
  return await mollieApiWrapper(`customers/${customerId}/subscriptions/${subscriptionId}`, 'GET');
}


export async function getPayment(paymentId) {
  return await mollieApiWrapper(`payments/${paymentId}`, 'GET');
}

// TODO [mollie] making this dynamic is pretty annoying, is there a better way?
export function getSubscriptionStartDate(now = new Date(), interval) {
  now.setMonth(now.getMonth() + 1);
  return now.toISOString().slice(0, 10);
}
