import wixData from 'wix-data';

import {createFirstPayment, createMollieCustomer} from './mollie';

async function createSubscriber(userId, email) {
  const customer = await createMollieCustomer(userId, email);
  return await wixData.save('Subscribers', {title: userId, email, mollieCustomerId: customer.id, isSubscribed: false});
}

export async function subscribe(userId, email) {
  const subscriberDataQuery = await wixData.query('Subscribers').eq('title', userId).find();
  const subscriber = subscriberDataQuery.items[0] || await createSubscriber(userId, email);  // should only be one at all times..
  const payment = await createFirstPayment(subscriber.mollieCustomerId);
  return payment.links.paymentUrl;
}
