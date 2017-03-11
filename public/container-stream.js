const Duplexify = require('duplexify').obj
const PortStream = require('../private/port-stream')

module.exports = SericeWorkerContainerStream


function SericeWorkerContainerStream(serviceWorker) {

  const duplex = Duplexify()

  serviceWorker.addEventListener('controllerchange', (event) => {
    console.log('controllerchange...')
  })

  serviceWorker.ready.then((registeredWorker) => {
    console.log('SericeWorkerContainerStream: ready')
    console.log('SericeWorkerContainerStream: ready', !!serviceWorker.controller)
    if (serviceWorker.controller) {
      establishConnection(serviceWorker)
    } else {
      console.log('gonna get stuck...')
      serviceWorker.addEventListener('controllerchange', (event) => {
        console.log('controllerchange...')
        establishConnection(event.target)
      })
    }    
  })

  return duplex

  function establishConnection(serviceWorker) {
    const messageChannel = new MessageChannel()
     messageChannel.port1.onmessage = (event) => {
      console.log('channel port1 heard message', event)
       // if (event.data.err) {
       //   reject(event.data.error)
       // } else {
       //   resolve(event.data.data)
       // }
    }
    console.log('posting handshake to serviceWorker')
    serviceWorker.controller.postMessage({ action: 'handshake' }, [messageChannel.port2])
    const portStream = new PortStream(messageChannel.port1)
    duplex.setWritable(portStream)
    duplex.setReadable(portStream)
  }

}