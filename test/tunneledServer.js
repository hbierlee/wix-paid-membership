import {post_firstPayment} from '../Backend/http-functions';
import express from 'express';
import bodyParser from 'body-parser';
import ngrok from 'ngrok';
import {WixHttpFunctionRequest} from '../mocks/wix-http-functions';

const config = require('../Backend/config');

const DEFAULT_PORT = 3000;

let resolveWebhook;
let rejectWebhook;

export async function waitForWebhookToSettle() {
  return await new Promise((resolve, reject) => {
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
      console.error('error in tunneledServer', e);
      res.sendStatus(500)
    }
  });

  app.listen(port);
}

export function setWebhooksToTunnelURL(url) {
  config['FIRST_PAYMENT_WEBHOOK'] = `${url}/firstPayment`;
}

export async function createTunneledServer(port = DEFAULT_PORT) {
  await startServer(port);
  const url = await ngrok.connect(port);
  setWebhooksToTunnelURL(url);
  return url;
}
