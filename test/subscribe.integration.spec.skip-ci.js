/* eslint-disable no-undef,camelcase */
import {testSubscribeAndResubscribe, testSubscribeAndResubscribeName} from './subscribeTests'
import {db, remove} from 'wix-data'
import chai from 'chai'
import {createTunneledServer, waitForWebhookToBeCalled} from './tunneledServer'
import {post_wixPaidMembershipRecurringPayment} from '../Backend/http-functions'
import {subscribe} from '../Backend/subscribe'
import opn from 'opn'
import {mollieApiWrapper} from '../Backend/mollie'
import {WixHttpFunctionRequest} from '../mocks/wix-http-functions'

describe('subscriptions (integration test, with Mollie test API)', function () {
  const userId = 'someMemberUserId'
  const email = 'someMemberEmail@email.com'

  it(testSubscribeAndResubscribeName, async function () {
    await testSubscribeAndResubscribe()
  })

  afterEach(function () {
    remove() // clear db
  })

  before(async function () {
    await createTunneledServer()
  })

  async function waitForFirstSubscriptionPayment (customerId) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          console.log('checking')
          const {_embedded: {payments}, count} = await mollieApiWrapper(`customers/${customerId}/payments`, 'GET')

          if (count === 2) {
            resolve(payments[0]) // resolve with the most recent payment
            clearInterval(interval)
          }
        } catch (e) {
          reject(e)
        }
      }, 10000)
    })
  }

  /**
     * This test case might take 5-15 minutes
     */
  it('should handle recurring payment requests', async function () {
    const {paymentUrl, mollieCustomerId} = await subscribe(userId, email)
    console.log('accept the first payment by selecting status \'paid\' at the following URL: ' + paymentUrl)
    opn(paymentUrl)
    await waitForWebhookToBeCalled()
    const firstSubscriptionPayment = await waitForFirstSubscriptionPayment(mollieCustomerId)
    await post_wixPaidMembershipRecurringPayment(new WixHttpFunctionRequest(firstSubscriptionPayment.id))

    chai.expect(db[0].hasActiveSubscription).to.be.true // eslint-disable-line no-unused-expressions
  })
})
