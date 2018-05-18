import {
  cancelMollieSubscription,
  getMollieSubscription
} from './mollie';

const log = [];

function print(statement) {
  log.push(statement);
}

function reject(reason) {
  return Promise.reject({
    reason,
    log
  });
}

function shouldDeleteSubscription(newItem, oldItem) {
  return (
    newItem.mollieCustomerId &&
    newItem.mollieSubscriptionId &&
    oldItem.hasActiveSubscription &&
    !newItem.hasActiveSubscription
  );
}

export function Subscribers_beforeUpdate(item, context) {
  const {
    currentItem
  } = context;
  if (shouldDeleteSubscription(item, currentItem)) {
    return getMollieSubscription(item.mollieCustomerId, item.mollieSubscriptionId)
      .then(subscription => {
        if (subscription && subscription.status === 'active') {
          return cancelMollieSubscription(item.mollieCustomerId, item.mollieSubscriptionId)
            .then(() => item)
            .catch(reject);
        }
      })
      .catch(error => {
        if (error.status === 410 || error.status === 404) { // subscription is already cancelled or not found
          return Promise.resolve(item);
        } else {
          return reject(error);
        }
      });
  }
}

export function Subscribers_beforeRemove(itemId, context) {
  const {
    currentItem: {
      mollieCustomerId,
      mollieSubscriptionId
    }
  } = context;
  if (mollieCustomerId && mollieSubscriptionId) {
    return cancelMollieSubscription(mollieCustomerId, mollieSubscriptionId)
      .then(() => itemId)
      .catch(() => Promise.resolve(itemId)); // this means there's no subscription
  }
}
