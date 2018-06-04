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

const TIMEOUT = 1800000

describe('subscriptions (integration test, with Mollie test API)', function () {
  afterEach(function () {
    remove() // clear db
  })

  before(async function () {
    await createTunneledServer()
  })

  it(subscribeAndResubscribeTestName, async function () {
    this.timeout(TIMEOUT)
    await testSubscribeAndResubscribe()
  })

  /**
     * This test case might take 5-15 minutes
     */
  it(recurringPaymentTestName, async function () {
    this.timeout(TIMEOUT)
    await testRecurringPayment()
  })

  it(failingRecurringPaymentTestName, async function () {
    this.timeout(TIMEOUT)
    await testFailingRecurringPayment()
  })
})
