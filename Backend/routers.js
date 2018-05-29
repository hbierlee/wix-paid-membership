import {ok, redirect, WixRouterSitemapEntry} from 'wix-router'
import {PREMIUM_PAGE_KEY, PREMIUM_PAGE_ROUTER_PREFIX, PREMIUM_PAGE_TITLE, SUBSCRIBE_PAGE_URL} from './config'
import {getSubscriberByUserId} from './database'

// eslint-disable-next-line camelcase
export async function premium_Router (request) {
  try {
    if (await hasPremiumAccess(request.user)) {
      return ok(PREMIUM_PAGE_KEY)
    } else {
      return redirect(SUBSCRIBE_PAGE_URL)
    }
  } catch (e) {
    console.error('error in router', e)
    return redirect(SUBSCRIBE_PAGE_URL)
  }
}

async function hasPremiumAccess ({id, role}) {
  if (role === 'Admin' || role === 'siteAdmin' || role === 'siteOwner') {
    return true
  } else if (role === 'Member' || role === 'siteMember') { // role naming seems to be different ('siteMember') when routing for some reason
    const subscriber = await getSubscriberByUserId(id)
    return subscriber && subscriber.hasActiveSubscription
  } else {
    return false
  }
}

// eslint-disable-next-line camelcase
export async function premium_SiteMap (request) {
  const premiumPageSitemapEntry = new WixRouterSitemapEntry(PREMIUM_PAGE_KEY)
  premiumPageSitemapEntry.pageName = PREMIUM_PAGE_TITLE
  premiumPageSitemapEntry.url = `/${PREMIUM_PAGE_ROUTER_PREFIX}`
  premiumPageSitemapEntry.title = PREMIUM_PAGE_TITLE
  return [premiumPageSitemapEntry]
}
