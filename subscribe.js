import {createFirstPayment, createMollieCustomer} from './mollie';
import {addSubscriber, getSubscriber} from './subscribers';

async function createSubscriber(userId, email) {
  const customer = await createMollieCustomer(userId, email);
  return await addSubscriber(userId, email, customer.id);
}

export async function subscribe(userId, email) {
  const subscriber = await getSubscriber(userId) || await createSubscriber(userId, email);  // should only be one at all times..
  // TODO maybe not make first payment when subscriber exists?
  const payment = await createFirstPayment(subscriber.mollieCustomerId);
  return payment.links.paymentUrl;
}
