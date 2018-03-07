const {subscribe} = require('../src/subscribe');

describe('subscribe functionality', function () {

  it('should work', async function () {
    process.env.CUSTOMER_EXISTS = false;
    const result = await subscribe('henk', 'bierlee.henk@gmail.com');
    console.log('r', result);
  });
});
