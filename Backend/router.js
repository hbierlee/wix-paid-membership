import {ok, redirect, WixRouterSitemapEntry} from 'wix-router';
import {PREMIUM_PAGE_KEY, PREMIUM_PAGE_ROUTER_PREFIX, PREMIUM_PAGE_TITLE, SUBSCRIBE_PAGE_URL} from './config';
import {getSubscriptionStatus} from './subscribe';

export async function premium_router(request) {
  try {
    const {user} = request;

    if (user.role === 'Admin' || user.role === 'siteAdmin' || user.role === 'siteOwner') {
      return ok(PREMIUM_PAGE_KEY);
    } else if ((user.role === 'Member' || user.role === 'siteMember') && await getSubscriptionStatus(user.id) === 'active') { // role naming seems to be different ('siteMember') when routing for some reason
      return ok(PREMIUM_PAGE_KEY);
    } else {  // 'Visitor', 'anonymous'
      return redirect(SUBSCRIBE_PAGE_URL);
    }
  } catch (e) {
    console.error('error in router', e);
    return redirect(SUBSCRIBE_PAGE_URL);
  }
}

export async function premium_sitemap() {
  const premiumPageSitemapEntry = new WixRouterSitemapEntry(PREMIUM_PAGE_KEY);
  premiumPageSitemapEntry.pageName = PREMIUM_PAGE_TITLE;
  premiumPageSitemapEntry.url = `/${PREMIUM_PAGE_ROUTER_PREFIX}`;
  premiumPageSitemapEntry.title = PREMIUM_PAGE_TITLE;
  return [premiumPageSitemapEntry];
}
