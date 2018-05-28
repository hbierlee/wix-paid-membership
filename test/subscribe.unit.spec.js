/* eslint-disable no-unused-expressions,no-undef,import/first */
import mock from 'mock-require'

mock('../Backend/mollie', '../mocks/mollie/mollie')
mock('opn', () => { console.log('skip opn in mocked test') })
mock('./tunneledServer', {
  createTunneledServer: () => {},
  waitForWebhookToBeCalled: async (paymentId) => {
    console.log('call webhook via mock')
    await post_wixPaidMembershipFirstPayment(new WixHttpFunctionRequest(paymentId))
  }
})

const {post_wixPaidMembershipFirstPayment} = mock.reRequire('../Backend/http-functions') // eslint-disable-line camelcase
const {testSubscribeAndResubscribe, testSubscribeAndResubscribeName} = mock.reRequire('./subscribeTests')
const {remove} = mock.reRequire('../mocks/wix-data')
const {WixHttpFunctionRequest} = mock.reRequire('../mocks/wix-http-functions')

describe('subscriptions (unit test, with mocked mollie API)', function () {
  it(testSubscribeAndResubscribeName, async function () {
    await testSubscribeAndResubscribe()
  })

  afterEach(function () {
    remove() // clear db
  })
})
