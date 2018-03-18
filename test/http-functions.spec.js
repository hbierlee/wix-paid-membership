import chai from 'chai';
import opn from 'opn';
import {subscribe} from '../Backend/subscribe';
import {db} from '../mocks/wix-data';
import {createPayment} from '../Backend/mollie';
import {createTunneledServer, waitForWebhookToSettle} from './tunneledServer';
import {RECURRING_PAYMENT_WEBHOOK} from '../Backend/config';

chai.use(require('chai-as-promised'));

const userName = 'memberUserName';
const email = 'memberEmail@email.com';

describe('webhook', function () {

  before(async function () {
    await createTunneledServer();
  });

  // NOTE: we're testing the api endpoints but we're letting mollie call them via the tunneled server
  it('should process a payment and (if successful) subscribe the customer. Then, it should unsubscribe the user if the following recurring payment is unsuccessful', async function () {
    // subscribe a new user, and let the use accept the 'first' payment
    const firstPayment = await subscribe(userName, email);
    console.log('accept the first payment by selecting status \'paid\' at the following URL: ' + firstPayment.paymentUrl);
    await opn(firstPayment.paymentUrl);

    // handle mollie's first payment webhook request
    await waitForWebhookToSettle();
    chai.expect(db[0].isSubscribed).to.equal(true);

    // create the recurring payment and let the user fail the recurring payment
    const recurringPayment = await createPayment(db[0].mollieCustomerId, false, RECURRING_PAYMENT_WEBHOOK);
    console.log('fail the second payment by selecting either \'expired\', \'failed\' or \'cancelled\' at the following URL: ' + recurringPayment.links.paymentUrl);
    await opn(recurringPayment.links.paymentUrl);

    // handle mollie's recurring payment request via webhook
    await waitForWebhookToSettle();
    chai.expect(db[0].isSubscribed).to.equal(false);
  });
});
