import {
  cancelMollieSubscription,
  getMollieSubscription
} from './mollie'

const log = []

// eslint-disable-next-line no-unused-vars
function print (statement) {
  log.push(statement)
}

function reject (reason) {
  return Promise.reject(new Error(JSON.stringify({
    reason,
    log
  })))
}

function shouldDeleteSubscription (newItem, oldItem) {
  return (
    newItem.mollieCustomerId &&
    newItem.mollieSubscriptionId &&
    oldItem.hasActiveSubscription &&
    !newItem.hasActiveSubscription
  )
}

// eslint-disable-next-line camelcase,no-unused-vars
export function Subscribers_beforeUpdate (item, context) {
  const {
    currentItem
  } = context
  if (shouldDeleteSubscription(item, currentItem)) {
    return getMollieSubscription(item.mollieCustomerId, item.mollieSubscriptionId)
      .then(subscription => {
        if (subscription && subscription.status === 'active') {
          return cancelMollieSubscription(item.mollieCustomerId, item.mollieSubscriptionId)
            .then(() => item)
            .catch(reject)
        }
      })
      .catch(() => Promise.resolve(item)) // this means there's no subscription
  } else {
    return item
  }
}

// eslint-disable-next-line camelcase,no-unused-vars
export function Subscribers_beforeRemove (itemId, context) {
  const {
    currentItem: {
      mollieCustomerId,
      mollieSubscriptionId
    }
  } = context
  if (mollieCustomerId && mollieSubscriptionId) {
    return cancelMollieSubscription(mollieCustomerId, mollieSubscriptionId)
      .then(() => itemId)
      .catch(() => Promise.resolve(itemId)) // this means there's no subscription
  }
}
