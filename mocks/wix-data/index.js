module.exports = {
  db: [],
  testSubscriber: {
    _id: 'some-database-id',
    mollieCustomerId: 'some-mollie-customer-id',
    userId: 'some-user-id',
    email: 'some@email.com',
    isSubscribed: false,
  },
  get(_, _id) {
    console.log('get', arguments);
    return module.exports.db.find(entry => entry._id === _id);
  },
  update(_, item) {
    console.log('update', arguments);
    const index = module.exports.db.findIndex(entry => entry._id === item._id);
    if (~index) { // cool way to check if index !== -1, which means the item is included in the db
      module.exports.db[index] = item;
    }
    return item;
  },
  insert(_, item) {
    console.log('insert', arguments);
    item._id = `id-${module.exports.db.length}`;
    module.exports.db.push(item);
    return item;
  },
  query() {
    console.log('query', arguments);
    return {
      eq(_, userId) {
        return {
          find() {
            return {items: module.exports.db.filter(entry => entry.userId === userId)};
          }
        }
      },
    };
  },
};
