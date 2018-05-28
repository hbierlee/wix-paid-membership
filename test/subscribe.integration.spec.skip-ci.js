/* eslint-disable no-undef,camelcase */
import {
  failingRecurringPaymentTestName,
  recurringPaymentTestName,
  subscribeAndResubscribeTestName,
  testFailingRecurringPayment,
  testRecurringPayment,
  testSubscribeAndResubscribe
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

  it(subscribeAndResubscribeTestName, async function () {
    this.timeout(0)
    await testSubscribeAndResubscribe()
  })

  /**
     * This test case might take 5-15 minutes
     */
  it(recurringPaymentTestName, async function () {
    this.timeout(0)
    await testRecurringPayment()
  })

  it(failingRecurringPaymentTestName, async function () {
    this.timeout(0)
    await testFailingRecurringPayment()
  })
})
