// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import {onUnsubscribe} from 'public/eventHandlers.js';
import {getSubscriptionStatus} from 'backend/subscribe';
import wixUser from 'wix-users';

export function unsubscribeButton_click(event, $w) {
  return onUnsubscribe();
}

const ACTIVE_SUBSCRIPTION_TEXT = 'Current subscription status: active';
const INACTIVE_SUBSCRIPTION_TEXT = 'Current subscription status: inactive';

$w.onReady(async function () {
  const hasActiveSubscription = await getSubscriptionStatus(wixUser.currentUser.id) === 'active';
  const subscriptionStatus = $w('#subscriptionStatus');
  subscriptionStatus.text = hasActiveSubscription ? ACTIVE_SUBSCRIPTION_TEXT : INACTIVE_SUBSCRIPTION_TEXT;
  subscriptionStatus.show();

  if (hasActiveSubscription) {
    $w('#unsubscribeButton').show();
  }
});
