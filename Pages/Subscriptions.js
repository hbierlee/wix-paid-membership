// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import {onUnsubscribe} from 'public/eventHandlers.js'
import {hasActiveSubscription} from 'backend/subscribe'
import wixUser from 'wix-users'

// eslint-disable-next-line camelcase
export function unsubscribeButton_click (event, $w) {
  return onUnsubscribe()
}

const ACTIVE_SUBSCRIPTION_TEXT = 'Current subscription status: active'
const INACTIVE_SUBSCRIPTION_TEXT = 'Current subscription status: inactive'

$w.onReady(async function () { // eslint-disable-line no-undef
  const userHasActiveSubscription = await hasActiveSubscription(wixUser.currentUser.id)

  const subscriptionStatus = $w('#subscriptionStatus') // eslint-disable-line no-undef
  subscriptionStatus.text = userHasActiveSubscription ? ACTIVE_SUBSCRIPTION_TEXT : INACTIVE_SUBSCRIPTION_TEXT
  subscriptionStatus.show()

  if (userHasActiveSubscription) {
    $w('#unsubscribeButton').show() // eslint-disable-line no-undef
  }
})
