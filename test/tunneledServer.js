import {post_firstPayment, post_recurringPayment} from '../Backend/http-functions';
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

  app.post(`/recurringPayment`, async function (req, res) {
    try {
      await post_recurringPayment(new WixHttpFunctionRequest(req.body.id));
      resolveWebhook();
      res.sendStatus(200);
    } catch (e) {
      console.error('error in tunneledServer', e);
      res.sendStatus(500)
    }
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}`));
}

export function setWebhooksToTunnelURL(url) {
  config['FIRST_PAYMENT_WEBHOOK'] = `${url}/firstPayment`;
  config['RECURRING_PAYMENT_WEBHOOK'] = `${url}/recurringPayment`;
}

export async function createTunneledServer(port = DEFAULT_PORT) {
  await startServer(port);
  const url = await ngrok.connect(port);
  setWebhooksToTunnelURL(url);
  return url;
}



// TODO why doesn't this work in the server?
// app.post('/', async function (req, res, next) {
//   try {
//     console.log(next());
//     console.log('resolve', req.path);
//     resolveWebhook();
//     res.sendStatus(200);
//   } catch (e) {
//     console.log('error in firstPayment api', e);
//     rejectWebhook();
//     res.sendStatus(500);
//   }
// });
