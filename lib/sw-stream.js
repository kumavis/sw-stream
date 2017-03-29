const PortStream = require('./message-channel-port-stream')

module.exports = SericeWorkerStream


function SericeWorkerStream({ serviceWorker, context }) {
  // create message channel for communication
  const messageChannel = new MessageChannel()
  // send handshake including port to respond on
  serviceWorker.postMessage({ action: 'handshake', context }, [messageChannel.port2])
  // construct stream around local message channel port
  const portStream = new PortStream(messageChannel.port1)
  return portStream
}