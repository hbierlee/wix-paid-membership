import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import {userIsSubscribed} from 'backend/subscribe';

export default async function allowSubscribersOnly(redirect = 'https://bierleehenk.wixsite.com/henk-bierlee') {
  const accessGranted = await userIsSubscribed(wixUsers.currentUser.id);
  if (!accessGranted) {
    wixLocation.to(redirect);
  }
}
