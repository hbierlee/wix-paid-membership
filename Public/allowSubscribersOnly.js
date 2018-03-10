import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import {userIsAllowedAccess} from 'backend/subscribe';

export default async function allowSubscribersOnly(redirect = '/subscribe') {
  const allowAccess = await userIsAllowedAccess(wixUsers.currentUser);
  if (!allowAccess) {
    wixLocation.to(redirect);
  }
}
