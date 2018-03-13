import wixUsers from 'wix-users';
import wixLocation from 'wix-location';

import {subscribe} from 'backend/subscribe';

// TODO rendering optimization needed?? https://support.wix.com/en/article/how-to-create-member-profile-pages-with-wix-code
export default async function onSubscribe() {
  const user = await getUser();
  const userEmail = await user.getEmail();
  const paymentUrl = await subscribe(user.id, userEmail);
  return wixLocation.to(paymentUrl);
}

/**
 * Gets or logins or registers user
 * @returns {Promise<*>}
 */
async function getUser() {
  if (wixUsers.currentUser.loggedIn) {
    return wixUsers.currentUser;
  } else {
    return await wixUsers.promptLogin({mode: 'login'});
  }
}
