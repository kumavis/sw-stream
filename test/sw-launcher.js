const EventEmitter = require('events')

const version = require('../stub').version
const SwStream = require('../lib/sw-stream')


module.exports = class ServiceWorkerLauncher extends EventEmitter {
  constructor (opts) {
    super()
    this.serviceWorker = navigator.serviceWorker
    this.startWorker()
    .then(registeredWorker => {
      console.log('setting up stream...')
      const duplex = SwStream(registeredWorker)
      duplex.on('data', (chunk) => {console.log('controller saw:', chunk) })
      duplex.on('error', (chunk) => {console.log('controller saw:', chunk) })
      duplex.write({ value: 42 })
    })
    .catch(err => {
      this.handleError(err)
    })
  }

  startWorker () {
    // check to see if their is a preregistered service worker
    if (!this.serviceWorker.controller) {
      console.log('registering...')
      return Promise.resolve(this.registerWorker())
    } else {
      console.log('ready')
      return Promise.resolve(this.serviceWorker.ready)
    }
  }

  registerWorker () {
    return this.serviceWorker.register('sw-bundle.js')
    .then(sw => {
      return sw
    })
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
