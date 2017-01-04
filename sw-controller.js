const EventEmitter = require('events')

module.exports = class serviceWorkerController extends EventEmitter{
  constructor (opts) {
    super()
    this.serviceWorker = navigator.serviceWorker
    this.registerWorker()
    .then(registerdWorker => {
      window.onfocus = this.syncSW.bind(this, registerdWorker)

      return this.syncSW(registerdWorker)
    })
    .catch(err => {
      this.handleError(err)
    })
  }

  registerWorker () {
    try {
      this.serviceWorker.addEventListener('message', this.handelIncomingMessage.bind(this))
      return this.serviceWorker.register('service-worker.js')
      .then(sw => {
        this.registerdWorker = sw
        return sw
      })
    } catch (err) {
      return Promise.reject(err)
    }

  }

  syncSW (registeredSW) {
    registeredSW.sync.register('sync')
    .then(() => {
      console.log('sync')
      return this.sendMessage('get count')
    })
    .then((data) => {
      this.emit('data', data)
    })
  }

  sendMessage (message) {
    const self = this
    return new Promise((resolve, reject) => {
       var messageChannel = new MessageChannel()
       messageChannel.port1.onmessage = (event) => {
         if (event.data.err) {
           reject(event.data.error)
         } else {
           resolve(event.data.data)
         }
       }
      self.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    })
  }
  handelIncomingMessage (message) {
    switch(message.data.message) {
      case 'err':
        return handleError(message.data.data)
      case 'counter':
        return this.emit('data', message.data.data)
      case 'SW Says: sync Received':
        message.ports[0].postMessage({version: 0})
        return this.emit('message', message.data.message)
      default:
        return this.emit('message', message.data.message)
    }
  }

  handleError (err, contextMessage) {
    if (!err) {
      console.error(contextMessage)
      this.emit('error', contextMessage)
    } else {
      console.error(err)
      this.emit('error', err)
    }
  }

  counter () {
    return this.sendMessage('counter')
    .then(data => this.emit('data', data))
  }
}
