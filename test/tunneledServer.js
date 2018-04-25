import {fetch} from 'wix-fetch';
import {post_firstPayment, post_recurringPayment} from '../Backend/http-functions';
import express from 'express';
import bodyParser from 'body-parser';
import ngrok from 'ngrok';
import {WixHttpFunctionRequest} from '../mocks/wix-http-functions';

const config = require('../Backend/config');

const DEFAULT_PORT = 3000;

let TUNNELED_SERVER_URL;
let resolveWebhook;
let rejectWebhook;

export async function waitForWebhookToBeCalled() {
  return new Promise((resolve, reject) => {
    resolveWebhook = resolve;
    rejectWebhook = reject;
  })
}

function startServer(port = DEFAULT_PORT) {
  const app = express();

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.post(`/firstPayment`, async function (req, res) {
    try {
      await post_firstPayment(new WixHttpFunctionRequest(req.body.id));
      resolveWebhook();
      res.sendStatus(200);
    } catch (e) {
      console.error('error in tunneledServer in firstPayment', e);
      res.sendStatus(500)
    }
  });

  app.post(`/recurringPayment`, async function (req, res) {
    try {
      await post_recurringPayment(new WixHttpFunctionRequest(req.body.id));
      resolveWebhook();
      res.sendStatus(200);
    } catch (e) {
      console.error('error in tunneledServer in recurringPayment', e);
      res.sendStatus(500)
    }
  });

  app.listen(port);
}

// TODO doesn't work somehow, might fix in the future
export async function callTunneledServer(endpoint, paymentId) {
  return TUNNELED_SERVER_URL && await fetch(`${TUNNELED_SERVER_URL}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(paymentId),
  });
}

export async function createTunneledServer(port = DEFAULT_PORT) {
  await startServer(port);
  TUNNELED_SERVER_URL = await ngrok.connect(port);
  config['FIRST_PAYMENT_WEBHOOK'] = `${TUNNELED_SERVER_URL}/firstPayment`;
  config['RECURRING_PAYMENT_WEBHOOK'] = `${TUNNELED_SERVER_URL}/recurringPayment`;
  return TUNNELED_SERVER_URL;
}
