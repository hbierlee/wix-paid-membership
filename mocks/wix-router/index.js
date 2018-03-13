module.exports = {
  ok() {
    return 'ok ' + arguments;
  },
  redirect() {
    return 'redirect ' + arguments;
  },
  sendStatus() {
    return 'send status ' + arguments;
  },
  forbidden() {
    return 'forbidden ' + arguments;
  }
};
