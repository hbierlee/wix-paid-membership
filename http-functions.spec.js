import mock from 'mock-require';

mock('wix-http-functions', {
  ok: function () {
    console.log('wix-http-functions called');
    return true;
  },
});

import {post_payments} from './http-functions';

describe('webhook', function () {

  it('should work', async function () {
    return post_payments({body: {id: 'tr_d0b0E3EA3v'}});
  });
});
