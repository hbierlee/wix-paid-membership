import {cancelMollieSubscription, getMollieSubscription} from './mollie';

const log = [];

function print(statement) {
  log.push(statement);
}

function reject(reason) {
  return Promise.reject({reason, log});
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
  const {currentItem} = context;
  if (shouldDeleteSubscription(item, currentItem)) {
    return getMollieSubscription(
      item.mollieCustomerId,
      item.mollieSubscriptionId,
    )
      .then(subscription => {
        if (subscription && subscription.status === 'active') {
          cancelMollieSubscription(
            item.mollieCustomerId,
            item.mollieSubscriptionId,
          )
            .then(() => Promise.resolve(item))
            .catch(e => Promise.reject(`Error in canceling subscription: ${e}`));
        }
      })
      .catch(() => Promise.resolve(item)); // this means there's no subscription
  }
}
  }
}
