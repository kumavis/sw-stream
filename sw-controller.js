const EventEmitter = require('events')

module.exports = class serviceWorkerController extends EventEmitter{
  constructor (opts) {
    super()
    this.serviceWorker = navigator.serviceWorker
    this.registerWorker()
  }

  registerWorker () {
    try {
      this.serviceWorker.register('service-worker.js', { scope: './' })
      .then(sw => {
        sw.onmessage = (mess) => console.dir(mess)
        sw.update()
        .then(val => {
          sw.sync.register('sync')
          .then(() => {
            console.log('sync')
            this.sendMessage('hello love')
            .then((data) => {
              this.emit('data', data)
            })
          })
          .catch(err => {
            this.handleError(err, 'Service worker sync failed')
          })
        })
        .catch(err => {
          this.handleError(err, 'Service worker update failed')
        })
      })
      .catch(err => {
        this.handleError(err, 'ServiceWorker failed to register. Are you visiting the HTTPS site?')
      })
    } catch (err) {
      this.handleError(err, 'The current browser doesn\'t support service workers.')
    }

  }
  setUpPeriodicSync () {
    this.serviceWorker.ready.then((registration) => {
    registration.periodicSync.register({
      tag: 'get-latest-news',         // default: ''
      minPeriod: 12 * 60 * 60 * 1000, // default: 0
      powerState: 'avoid-draining',   // default: 'auto'
      networkState: 'avoid-cellular'  // default: 'online'
    }).then(function(periodicSyncReg) {
    // success
    }, function() {
    // failure
    })
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
