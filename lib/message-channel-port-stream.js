const Duplex = require('readable-stream').Duplex
const inherits = require('util').inherits

module.exports = MessageChannelPortDuplexStream


inherits(MessageChannelPortDuplexStream, Duplex)

function MessageChannelPortDuplexStream (port) {
  Duplex.call(this, {
    objectMode: true,
  })
  this._port = port
  port.onmessage = this._onMessage.bind(this)
}

// private

MessageChannelPortDuplexStream.prototype._onMessage = function (event) {
  const msg = event.data
  if (Buffer.isBuffer(msg)) {
    delete msg._isBuffer
    var data = new Buffer(msg)
    this.push(data)
  } else {
    this.push(msg)
  }
}

// stream plumbing

MessageChannelPortDuplexStream.prototype._read = noop

MessageChannelPortDuplexStream.prototype._write = function (msg, encoding, cb) {
  try {
    if (Buffer.isBuffer(msg)) {
      var data = msg.toJSON()
      data._isBuffer = true
      this._port.postMessage(data)
    } else {
      this._port.postMessage(msg)
    }
  } catch (err) {
    return cb(new Error('MessageChannelPortDuplexStream - disconnected'))
  }
  cb()
}

// util

function noop () {}
