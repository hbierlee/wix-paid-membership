import {fetch} from 'wix-fetch';

import {
  FIRST_PAYMENT_WEBHOOK,
  MOLLIE_API_KEY,
  PAYMENT_DESCRIPTION,
  PREMIUM_PAGE_ROUTER_URL,
  RECURRING_PAYMENT_WEBHOOK,
  SUBSCRIPTION_AMOUNT,
  SUBSCRIPTION_INTERVAL,
} from './config';
import {SITE_API_URL} from './http-functions';

const MOLLIE_API_URL = 'https://api.mollie.com/v1';
const MOLLIE_AUTH_HEADERS = {
  Authorization: `Bearer ${MOLLIE_API_KEY}`,
};

async function mollieApiWrapper(fetch) {
  const response = await fetch();
  const json = await response.json();

  if (json.error) {
    throw new Error(`Error in mollie API call:\n${JSON.stringify(json.error, null, 2)}`);
  } else {
    return json;
  }
}

export async function createMollieCustomer(name, email, wixSubscriberId) {
  return await mollieApiWrapper(() => fetch(`${MOLLIE_API_URL}/customers`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({name, email, metadata: JSON.stringify({wixSubscriberId})}),
  }));
}

export async function getCustomer(customerId) {
  return await mollieApiWrapper(() => fetch(`${MOLLIE_API_URL}/customers/${customerId}`, {
    method: 'GET',
    headers: MOLLIE_AUTH_HEADERS,
  }));
}

/**
 *
 * @param customerId
 * @param recurringType should be 'first' when creating first payments
 * @returns {Promise<void>}
 */
export async function createPayment(customerId, recurringType) {
  const data = {
    customerId,
    amount: SUBSCRIPTION_AMOUNT,
    description: PAYMENT_DESCRIPTION,  // TODO
    redirectUrl: PREMIUM_PAGE_ROUTER_URL,
    webhookUrl: FIRST_PAYMENT_WEBHOOK,
  };

  if (recurringType) {
    data.recurringType = recurringType;
  }

  return await mollieApiWrapper(() => fetch(`${MOLLIE_API_URL}/payments`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify(data),
  }));
}

export async function getMandates(customerId) {
  return await mollieApiWrapper(() => fetch(`${MOLLIE_API_URL}/customers/${customerId}/mandates`, {
    method: 'GET',
    headers: MOLLIE_AUTH_HEADERS,
  }));
}

export async function createSubscription(customerId) {
  return await mollieApiWrapper(() => fetch(`${MOLLIE_API_URL}/customers/${customerId}/subscriptions`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({
      amount: SUBSCRIPTION_AMOUNT,
      startDate: getSubscriptionStartDate(),
      interval: SUBSCRIPTION_INTERVAL,
      description: PAYMENT_DESCRIPTION,
      webhookUrl: RECURRING_PAYMENT_WEBHOOK, // TODO probably no need to disable webhook to test this
    }),
  }));
}

export function getSubscriptionStartDate(now = new Date()) {
  now.setMonth(now.getMonth() + 1);
  return now.toISOString().slice(0, 10);
}

export async function getPayment(paymentId) {
  return await mollieApiWrapper(() => fetch(`${MOLLIE_API_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: MOLLIE_AUTH_HEADERS,
  }));
}
