const {subscribe} = require('./subscribe');

describe('subscribe functionality', function () {

  it('should work', async function () {
    process.env.CUSTOMER_EXISTS = false;
    const result = await subscribe('henk', 'bierlee.henk@gmail.com');
    console.log('r', result);
  });

  // xit('should get mandate', async function () {
  //   const id = 'cst_EvA7recMjx';
  //   await getMandate(id);
  // });
  //
  // Pending test 'should work'
  // m { totalCount: 1,
  //   offset: 0,
  //   count: 1,
  //   data:
  //   [ { resource: 'mandate',
  //     id: 'mdt_kscVtBE6zW',
  //     status: 'valid',
  //     method: 'directdebit',
  //     details: [Object],
  //     customerId: 'cst_EvA7recMjx',
  //     links: [Object],
  //     signatureDate: '2018-03-06',
  //     createdDatetime: '2018-03-06T10:16:03.0Z' } ] }
});
