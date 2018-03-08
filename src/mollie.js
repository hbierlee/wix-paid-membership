import {fetch} from 'wix-fetch';

import {firstPaymentWebhookUrl, recurringPaymentWebhookUrl} from './http-functions';


// settings and constants
const MOLLIE_API_KEY = 'test_xDBcNmGEcf9dfHxjCw9TtbjPj554cb'; // TEST KEY
const MOLLIE_API_URL = 'https://api.mollie.com/v1';
const MOLLIE_AUTH_HEADERS = {
  Authorization: `Bearer ${MOLLIE_API_KEY}`,
};
const SUBSCRIPTION_MONTHLY_AMOUNT = '0.01';

export async function createMollieCustomer(name, email, subscriberId) {
  const customer = await fetch(`${MOLLIE_API_URL}/customers`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({name, email, metadata: JSON.stringify({subscriberId})}),
  });
  return await customer.json();
}

export async function getCustomer(customerId) {
  const customer = await fetch(`${MOLLIE_API_URL}/customers/${customerId}`, {
    method: 'GET',
    headers: MOLLIE_AUTH_HEADERS,
  });
  return await customer.json();
}

export async function createFirstPayment(customerId) {

  const payment = await fetch(`${MOLLIE_API_URL}/payments`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({
      customerId,
      amount: SUBSCRIPTION_MONTHLY_AMOUNT,
      recurringType: 'first',
      description: 'first payment',
      redirectUrl: 'https://bierleehenk.wixsite.com/henk-bierlee/blank-page-1',
      webhookUrl: firstPaymentWebhookUrl,
    }),
  });
  return await payment.json();
}

export async function getMandates(customerId) {
  const mandate = await fetch(`${MOLLIE_API_URL}/customers/${customerId}/mandates`, {
    method: 'GET',
    headers: MOLLIE_AUTH_HEADERS,
  });
  return await mandate.json();
}

export async function createSubscription(customerId) {
  const subscription = await fetch(`${MOLLIE_API_URL}/customers/${customerId}/subscriptions`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({
      amount: SUBSCRIPTION_MONTHLY_AMOUNT,
      startDate: getSubscriptionStartDate(),
      interval: '1 month',
      description: 'Monthly subscription payment',
      webhookUrl: recurringPaymentWebhookUrl,
    }),
  });
  return await subscription.json();
}

export function getSubscriptionStartDate(now = new Date()) {
  now.setMonth(now.getMonth() + 1);
  return now.toISOString().slice(0, 10);
}

export async function getPayment(paymentId) {
  const payment = await fetch(`${MOLLIE_API_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: MOLLIE_AUTH_HEADERS,
  });
  return await payment.json();
}
