import {createFirstPayment, createMollieCustomer} from './mollie';
import {addSubscriber, getSubscriberByUserId, updateSubscriber} from './database';
//
//
// s { title: 'ea80f374-7ac4-4a8b-93f0-22be62254566',
//   email: 'bierlee.henk+member@gmail.com',
//   isSubscribed: false,
//   _owner: 'ea80f374-7ac4-4a8b-93f0-22be62254566',
//   _id: 'e2132080-f6d2-4017-b9d6-7b6b2841311d',
//   _createdDate: 2018-03-07T14:18:23.670Z,
//   _updatedDate: 2018-03-07T14:18:23.670Z }

async function createSubscriber(userId, email) {
  const subscriber = await addSubscriber(userId, email);
  const customer = await createMollieCustomer(userId, email, subscriber._id);
  subscriber.mollieCustomerId = customer.id;
  return await updateSubscriber(subscriber);
}

export async function subscribe(userId, email) {
  const subscriber = await getSubscriberByUserId(userId) || await createSubscriber(userId, email);  // should only be one at all times..
  console.log('s', subscriber);
  // TODO maybe not make first payment when subscriber exists?
  const payment = await createFirstPayment(subscriber.mollieCustomerId);
  return payment.links.paymentUrl;
}
