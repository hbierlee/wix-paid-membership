import {fetch} from 'wix-fetch'
// eslint-disable-next-line camelcase
import {post_wixPaidMembershipFirstPayment, post_wixPaidMembershipRecurringPayment} from '../Backend/http-functions'
import express from 'express'
import bodyParser from 'body-parser'
import ngrok from 'ngrok'
import {WixHttpFunctionRequest} from '../mocks/wix-http-functions'

const config = require('../Backend/config')

const DEFAULT_PORT = 3000

let TUNNELED_SERVER_URL
let resolveWebhook
let rejectWebhook

export async function waitForWebhookToBeCalled () {
  return new Promise((resolve, reject) => {
    resolveWebhook = resolve
    rejectWebhook = reject
  })
}

function startServer (port = DEFAULT_PORT) {
  const app = express()

  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())

  app.post(`/wixPaidMembershipFirstPayment`, async function (req, res) {
    try {
      await post_wixPaidMembershipFirstPayment(new WixHttpFunctionRequest(req.body.id))
      resolveWebhook()
      res.sendStatus(200)
    } catch (e) {
      console.error('error in tunneledServer in wixPaidMembershipFirstPayment', e)
      rejectWebhook()
      res.sendStatus(500)
    }
  })

  app.post(`/wixPaidMembershipRecurringPayment`, async function (req, res) {
    try {
      await post_wixPaidMembershipRecurringPayment(new WixHttpFunctionRequest(req.body.id))
      resolveWebhook()
      res.sendStatus(200)
    } catch (e) {
      console.error('error in tunneledServer in wixPaidMembershipRecurringPayment', e)
      rejectWebhook()
      res.sendStatus(500)
    }
  })

  app.listen(port)
}

// TODO doesn't work somehow, might fix in the future
export async function callTunneledServer (endpoint, paymentId) {
  return TUNNELED_SERVER_URL && fetch(`${TUNNELED_SERVER_URL}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(paymentId)
  })
}

export async function createTunneledServer (port = DEFAULT_PORT) {
  await startServer(port)
  TUNNELED_SERVER_URL = await ngrok.connect(port)
  config['SITE_API_URL'] = TUNNELED_SERVER_URL
  return TUNNELED_SERVER_URL
}
