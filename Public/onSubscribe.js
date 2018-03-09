import wixUsers from 'wix-users';
import wixLocation from 'wix-location';

import {subscribe} from 'backend/subscribe';

export default async function onSubscribe() {
  const userId = wixUsers.currentUser.id;
  const userEmail = await wixUsers.currentUser.getEmail();
  const paymentUrl = await subscribe(userId, userEmail);
  wixLocation.to(paymentUrl);
}
