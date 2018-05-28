/* eslint-disable no-unused-expressions,no-undef,import/first */
import mock from 'mock-require'
import {remove} from '../mocks/wix-data/'

mock('../Backend/mollie', '../mocks/mollie/mollie')
mock('opn', () => { console.log('skip opn in mocked test') })
mock('./tunneledServer', {
  createTunneledServer: () => {},
  waitForWebhookToBeCalled: async (paymentId) => {
    console.log('call webhook via mock')
    await post_wixPaidMembershipFirstPayment(new WixHttpFunctionRequest(paymentId))
  }
})

const {resetMockedMollieDb} = mock.reRequire('../mocks/mollie/mollie')
const {post_wixPaidMembershipFirstPayment} = mock.reRequire('../Backend/http-functions') // eslint-disable-line camelcase
const {testSubscribeAndResubscribe, testSubscribeAndResubscribeName, recurringPaymentTestName, testRecurringPayment, testFailingRecurringPayment} = mock.reRequire('./subscribeTests')
const {WixHttpFunctionRequest} = mock.reRequire('../mocks/wix-http-functions')

describe('subscriptions (unit test, with mocked mollie API)', function () {
  it(testSubscribeAndResubscribeName, async function () {
    return testSubscribeAndResubscribe()
  })

  it(recurringPaymentTestName, async function () {
    return testRecurringPayment()
  })

  it('should unsubscribe user if recurring payment fails', async function () {
    await testFailingRecurringPayment()
  })

  afterEach(async function () {
    await remove()
    resetMockedMollieDb()
  })
})
