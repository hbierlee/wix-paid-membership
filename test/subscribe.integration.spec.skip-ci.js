/* eslint-disable no-undef,camelcase */
import {
  recurringPaymentTestName,
  testRecurringPayment,
  testSubscribeAndResubscribe,
  testSubscribeAndResubscribeName,
} from './subscribeTests'
import {remove} from 'wix-data'
import {createTunneledServer} from './tunneledServer'

describe('subscriptions (integration test, with Mollie test API)', function () {

  afterEach(function () {
    remove() // clear db
  })

  before(async function () {
    await createTunneledServer()
  })

  it(testSubscribeAndResubscribeName, async function () {
    await testSubscribeAndResubscribe()
  })

  /**
     * This test case might take 5-15 minutes
     */
  it(recurringPaymentTestName, async function () {
    await testRecurringPayment()
  })
})
