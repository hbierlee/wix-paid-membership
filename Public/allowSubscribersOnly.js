import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import {userIsSubscribed} from 'backend/subscribe';

export default async function allowSubscribersOnly(redirect = 'https://bierleehenk.wixsite.com/henk-bierlee') {

  const userId = wixUsers.currentUser.id;
  const accessGranted = await userIsSubscribed(userId);
  if (!accessGranted) {
    wixLocation.to(redirect);
  }
}
