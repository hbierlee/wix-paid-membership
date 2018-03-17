module.exports = {
  testSubscriber: {
    _id: 'some-database-id',
    mollieCustomerId: 'some-mollie-customer-id',
    userId: 'some-user-id',
    email: 'some@email.com',
    isSubscribed: false,
  },
  get() {
    console.log('get', arguments);
    return module.exports.testSubscriber;
  },
  save(_, item) {
    console.log('save', arguments);
    process.env.CUSTOMER_EXISTS = true;
    return item;
  },
  update(_, item) {
    console.log('update', arguments);
    process.env.CUSTOMER_EXISTS = true;
    return item;
  },
  insert(_, item) {
    console.log('insert', arguments);
    process.env.CUSTOMER_EXISTS = true;
    return item;
  },
  query() {
    console.log('query', arguments);
    return {
      eq() {
        return {
          find() {
            return {items: process.env.CUSTOMER_EXISTS === 'true' ? [module.exports.testSubscriber] : []};
          }
        }
      },
    };
  },
};
