const Duplex = require('readable-stream').Duplex
const inherits = require('util').inherits

module.exports = MessagePortDuplexStream

inherits(MessagePortDuplexStream, Duplex)

function MessagePortDuplexStream (port) {
  Duplex.call(this, {
    objectMode: true,
  })
  this._port = port
  port.onmessage = this._onMessage.bind(this)
}

// private

MessagePortDuplexStream.prototype._onMessage = function (event) {
  const msg = event.data
  if (Buffer.isBuffer(msg)) {
    delete msg._isBuffer
    var data = new Buffer(msg)
    // console.log('MessagePortDuplexStream - saw message as buffer', data)
    this.push(data)
  } else {
    // console.log('MessagePortDuplexStream - saw message', msg)
    this.push(msg)
  }
}

// stream plumbing

MessagePortDuplexStream.prototype._read = noop

MessagePortDuplexStream.prototype._write = function (msg, encoding, cb) {
  try {
    if (Buffer.isBuffer(msg)) {
      var data = msg.toJSON()
      data._isBuffer = true
      // console.log('MessagePortDuplexStream - sent message as buffer', data)
      this._port.postMessage(data)
    } else {
      // console.log('MessagePortDuplexStream - sent message', msg)
      this._port.postMessage(msg)
    }
  } catch (err) {
    // console.error(err)
    return cb(new Error('MessagePortDuplexStream - disconnected'))
  }
  cb()
}

// util

function noop () {}
