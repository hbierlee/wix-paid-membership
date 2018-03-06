// import {
//   fetch
// }
//   from 'wix-fetch';
// import {
//   ok, notFound, serverError
// }
//   from 'wix-http-functions';

import fetch from 'node-fetch';

import {MOLLIE_API_KEY, MOLLIE_API_URL, MOLLIE_AUTH_HEADERS} from './constants';

function ok() {
  console.log('ok');
  return true;
}
function serverError(error) {
  console.error('err', error);
  return false;
}


export const webhookUrl = 'https://bierleehenk.wixsite.com/henk-bierlee/_functions-dev/payment';
export async function post_payments(request) {
  const paymentId = request.body.id;

  const paymentResponse = await fetch(`${MOLLIE_API_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: MOLLIE_AUTH_HEADERS,
  });
  const payment = await paymentResponse.json();

  if (payment.error) {
    serverError(payment.error);
    return false;
  } else {


    console.log('p', payment);
    ok({a: 'b'});
  }

  // const options = {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: {
  //     bodySend: request,
  //   },
  // };
  //
  // console.log('webhook', request);
  // return ok(options);
}
