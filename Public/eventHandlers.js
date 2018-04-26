import wixUsers from 'wix-users';
import wixLocation from 'wix-location';

import {subscribe, unsubscribe} from 'backend/subscribe';

// TODO rendering optimization needed?? https://support.wix.com/en/article/how-to-create-member-profile-pages-with-wix-code
export async function onSubscribe() {
  if (!wixUsers.currentUser.loggedIn) {
    await wixUsers.promptLogin({mode: 'login'});
  }

  const {currentUser} = wixUsers;
  const userEmail = await currentUser.getEmail();
  const {paymentUrl} = await subscribe(currentUser.id, userEmail);
  return wixLocation.to(paymentUrl);
}

export async function onUnsubscribe() {
  await unsubscribe(wixUsers.currentUser.id);
  refresh();
}

function refresh() {
  return wixLocation.to(wixLocation.url);
}
