const EventEmitter = require('events')

const version = require('../stub').version
const ContainerStream = require('./container-stream')


module.exports = class ServiceWorkerLauncher extends EventEmitter {
  constructor (opts) {
    super()
    this.serviceWorker = navigator.serviceWorker
    
    let duplex = ContainerStream(this.serviceWorker)
    duplex.on('data', (chunk) => {console.log('controller saw:', chunk) })
    duplex.on('error', (chunk) => {console.log('controller saw:', chunk) })

    duplex.write({ value: 42 })

    this.startWorker()
    .then(registeredWorker => {
      // this.establishConnection()
      // registeredWorker.onupdatefound = () => {
      //   this.sendMessage('update found').then((reply) => {
      //     // registerWorker.update()
      //   })
      // }
    })
    .catch(err => {
      this.handleError(err)
    })
  }

  startWorker () {
    // this.serviceWorker.addEventListener('message', this.handelIncomingMessage.bind(this))
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
