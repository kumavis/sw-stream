const EventEmitter = require('events')
const version = require('../stub').version


module.exports = class serviceWorkerController extends EventEmitter{
  constructor (opts) {
    super()
    this.serviceWorker = navigator.serviceWorker
    this.startWorker()
    .then(registerdWorker => {
      window.onfocus = this.syncSW.bind(this, registerdWorker)
      this.sendMessage('tell me')
      registerdWorker.onupdatefound =  () => {
        this.sendMessage('update found').then((reply) => {
          // registerWorker.update()
        })
      }

      return this.syncSW(registerdWorker)
    })
    .catch(err => {
      this.handleError(err)
    })
  }

  createPorts () {
    var messageChannel = new MessageChannel()
    return Promise.resolve([messageChannel.port1, messageChannel.port2])
  }

  startWorker () {
    this.serviceWorker.addEventListener('message', this.handelIncomingMessage.bind(this))
    // check to see if their is a preregistered service worker
    if (!this.serviceWorker.controller) {
      return Promise.resolve(this.registerWorker())
    } else {
      return Promise.resolve(this.serviceWorker.ready)
    }
  }

  registerWorker () {
    return this.serviceWorker.register('sw-bundle.js')
    .then(sw => {
      return sw
    })
  }

  syncSW (registeredSW) {
    return registeredSW.sync.register('sync')
    .then(() => {
      console.log('sync')
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
  handelIncomingMessage (message, context) {
    const data = message.data
    switch(data.message) {
      case 'err':
        return handleError(message)
      case 'counterIncreased':
        return this.emit('data', data.data)
      case 'SW Says':
        if (data.full === 'SW Says: sync Received') {
          this.emit('data', data.data.counter)
        }
        message.ports[0].postMessage({version})
        return this.emit('message', data.full)
      default:
        return this.emit('other', `${data.data}${data.message}`)
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
}
