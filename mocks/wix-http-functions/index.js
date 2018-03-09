module.exports = {
  ok() {
    console.log('ok', arguments);
    return true;
  },
  notFound() {
    console.log('notFound', arguments);
    return true;
  },
  serverError() {
    console.log('serverError', arguments);
    return true;
  },
  badRequest() {
    console.log('badRequest', arguments);
    return false;
  },
};
