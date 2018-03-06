// import {
//   fetch
// }
//   from 'wix-fetch';
import {wix-users}
import fetch from 'node-fetch';

import {MOLLIE_API_URL, MOLLIE_AUTH_HEADERS} from './constants';
import {webhookUrl} from './http-functions';


export async function subscribe(name, email) {
  const customerResponse = await fetch(`${MOLLIE_API_URL}/customers`, {
    method: 'POST',
    headers: MOLLIE_AUTH_HEADERS,
    body: JSON.stringify({name, email}),
  });

  const {id: customerId} = await customerResponse.json();

  const paymentResponse = await fetch(`${MOLLIE_API_URL}/payments`,
    {
      method: 'POST',
      headers: MOLLIE_AUTH_HEADERS,
      body: JSON.stringify({
        customerId,
        amount: '0.01',
        recurringType: 'first',
        description: 'first payment',
        redirectUrl: 'https://www.google.com',
        webhookUrl,
      })
    });

  const payment = await paymentResponse.json();
  return payment.links.paymentUrl;
}
