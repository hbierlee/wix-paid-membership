import {ok, redirect} from 'wix-router';
import {getSubscriberByUserId} from './database';
import {PREMIUM_PAGE_NAME, SUBSCRIBE_PAGE_URL} from './config';

async function userIsSubscribed(userId) {
  const subscriber = await getSubscriberByUserId(userId);
  return subscriber && subscriber.isSubscribed;
}

export async function premium_Router(request) {
  try {
    const {user} = request;

    if (user.role === 'Admin' || user.role === 'siteAdmin' || user.role === 'siteOwner') {
      return ok(PREMIUM_PAGE_NAME);
    } else if ((user.role === 'Member' || user.role === 'siteMember') && await userIsSubscribed(user.id)) { // role naming seems to be different ('siteMember') when routing for some reason
      return ok(PREMIUM_PAGE_NAME);
    } else {  // 'Visitor', 'anonymous'
      return redirect(SUBSCRIBE_PAGE_URL);
    }
  } catch (e) {
    console.error('error in router', e);
    return redirect(SUBSCRIBE_PAGE_URL);
  }
}

export async function premium_SiteMap() {
  return []; // TODO
}
