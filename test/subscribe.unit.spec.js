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

const chai = mock.reRequire('chai')
const {getSubscriberByUserId, createSubscriber} = mock.reRequire('../Backend/database')
const {subscribe} = mock.reRequire('../Backend/subscribe')
const {resetMockedMollieDb} = mock.reRequire('../mocks/mollie/mollie')
const {post_wixPaidMembershipFirstPayment} = mock.reRequire('../Backend/http-functions') // eslint-disable-line camelcase
const {testSubscribeAndResubscribe, subscribeAndResubscribeTestName, recurringPaymentTestName, testRecurringPayment, testFailingRecurringPayment, failingRecurringPaymentTestName} = mock.reRequire('./subscribeTests')
const {WixHttpFunctionRequest} = mock.reRequire('../mocks/wix-http-functions')

describe('subscriptions (unit test, with mocked mollie API)', function () {
  it(subscribeAndResubscribeTestName, async function () {
    return testSubscribeAndResubscribe()
  })

  it(recurringPaymentTestName, async function () {
    return testRecurringPayment()
  })

  it(failingRecurringPaymentTestName, async function () {
    await testFailingRecurringPayment()
  })

  it('should create a mollie customer when an existing subscriber lacks it', async function () {
    const userId = 'someTestUserId'
    const email = 'some@email.com'
    await createSubscriber(userId, email)
    const subscriber = await getSubscriberByUserId(userId)
    chai.expect(subscriber.mollieCustomerId).to.not.exist

    await subscribe(userId, email)
    chai.expect(subscriber.mollieCustomerId).to.exist
  })

  afterEach(async function () {
    await remove()
    resetMockedMollieDb()
  })
})
