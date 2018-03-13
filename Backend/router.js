import {ok, redirect, forbidden} from 'wix-router';
import {getSubscriberByUserId} from './database';

const REDIRECT_URL = 'https://bierleehenk.wixsite.com/henk-bierlee/subscribe';

async function userIsSubscribed(userId) {
  const subscriber = await getSubscriberByUserId(userId);
  return subscriber && subscriber.isSubscribed;
}

export async function subscribers_Router(request) {
  try {
    const {user} = request;

    if (user.role === 'Admin') {
      return ok('Premium');
    } else if ((user.role === 'Member' || user.role === 'siteMember') && await userIsSubscribed(user.id)) { // role naming seems to be different ('siteMember') when routing for some reason
      return ok('Premium');
    } else {  // 'Visitor'
      return redirect(REDIRECT_URL); // TODO will this prompt login? probably when subscribers page is in member page (as it should be)
    }
  } catch (e) {
    console.error('error in router', e);
    return redirect(REDIRECT_URL);
  }
}

export async function subscribers_SiteMap() {
  return []; // TODO
}
