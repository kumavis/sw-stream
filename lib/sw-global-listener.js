const EventEmitter = require('events')
const PortStream = require('./message-channel-port-stream')


class SwGlobalListener extends EventEmitter {

  constructor (swGlobal) {
    super()
    swGlobal.addEventListener('message', (messageEvent) => {
      // validate port
      if (!messageEvent.data) return
      if (messageEvent.data.action !== 'handshake') return
      // process message
      const port = messageEvent.ports[0]
      if (!port) throw new Error('Handshake missing port...')
      // create new portStream
      const portStream = new PortStream(port)
      // announce new connection
      this.emit('remote', portStream, messageEvent)
    })
  }

}

module.exports = SwGlobalListener