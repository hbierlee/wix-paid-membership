const SUBSCRIPTION_MONTHLY_AMOUNT = '0.01';

import {fetch} from 'wix-fetch';

import {MOLLIE_API_URL, MOLLIE_AUTH_HEADERS} from './constants';
import {firstPaymentWebhookUrl, recurringPaymentWebhookUrl} from './http-functions';

export async function createMollieCustomer(name, email) {
  const customer = await fetch(`${MOLLIE_API_URL}/customers`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({name, email}),
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
      redirectUrl: 'https://www.google.com',
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
      interval: '1 month',
      description: 'Monthly subscription payment',
      webhookUrl: recurringPaymentWebhookUrl,
    }),
  });
  return await subscription.json();
}

export async function getPayment(paymentId) {
  const payment = await fetch(`${MOLLIE_API_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: MOLLIE_AUTH_HEADERS,
  });
  return await payment.json();
}
