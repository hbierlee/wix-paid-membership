import wixUsers from 'wix-users';

// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import {
  subscribe
}
  from 'backend/subscribe';
import wixLocation from 'wix-location';

$w.onReady(function () {
  //TODO: write your page related code here...

});

export function subscribeButton_click(event, $w) {
  console.log('hello', wixUsers.currentUser)

  wixUsers.currentUser.getEmail().then(userEmail => {
    console.log('sub', userEmail);
    subscribe(wixUsers.currentUser.id, wixUsers.currentUser.id, userEmail)
      .then((paymentUrl) => {
        console.log('r', paymentUrl);
        wixLocation.to(paymentUrl);
      })
      .catch((error) => {
        console.log('e', error);
      });
  }).catch(console.error);
}