import {fetch} from 'wix-fetch';
import wixData from 'wix-data';

import {MOLLIE_API_URL, MOLLIE_AUTH_HEADERS} from './constants';
import {webhookUrl} from './http-functions';

async function createCustomer(userId, name, email) {
  const customerResponse = await fetch(`${MOLLIE_API_URL}/customers`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({name, email}),
  });
  const customer = await customerResponse.json();
  await wixData.save('Subscribers', {title: userId, mollieCustomerId: customer.id});
  return customer;
}

export async function subscribe(userId, name, email) {
  const userDataQuery = await wixData.query('Subscribers').eq('title', userId).find();
  const user = userDataQuery.items[0];  // should only be one at all times..
  const customerId = user ?
    user.mollieCustomerId :
    (await createCustomer(userId, name, email)).id;

  const paymentResponse = await fetch(`${MOLLIE_API_URL}/payments`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({
      customerId,
      amount: '0.01',
      recurringType: 'first',
      description: 'first payment',
      redirectUrl: 'https://www.google.com',
      webhookUrl,
    }),
  });

  const payment = await paymentResponse.json();
  return payment.links.paymentUrl;
}
