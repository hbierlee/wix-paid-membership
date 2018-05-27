module.exports = {
  ok () {
    console.log('ok', arguments)
    return true
  },
  notFound () {
    console.log('notFound', arguments)
    return true
  },
  serverError (response) {
    console.log('serverError', arguments)
    console.log('error:', response.body.error)
    return true
  },
  badRequest () {
    console.log('badRequest', arguments)
    return false
  },
  WixHttpFunctionRequest: class {
    constructor (paymentId) {
      this.body = {
        text: () => `id=${paymentId}`
      }
    }
  }
}
