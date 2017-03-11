const EventEmitter = require('events')
const id = Math.random()
const PortStream = require('./port-stream')
// sendMessageToAllClients('The service worker just started up.')

self.addEventListener('activate', function(event) {
  console.log(id, 'activate')
  event.waitUntil(self.clients.claim())
})

self.oninstall = function (event) {
  // cache the state of the app and ui so that
  // you can restart
  // in the right place
  console.log(id, 'oninstall')
  event.waitUntil(self.skipWaiting())
  // where you could posibly hault all things so
  // that the service worker can update
}

const remoteStreams = new WeakMap()

console.log('sw listening for messages')
self.addEventListener('message', (messageEvent) => {
  // validate port
  if (!messageEvent.data) return
  // process message
  if (messageEvent.data.action === 'handshake') {
    const port = messageEvent.ports[0]
    if (!port) throw new Error('Handshake missing port...')
    // create new portStream
    const portStream = new PortStream(port)
    remoteStreams.set(port, portStream)
    // announce new connection
    // this.emit('remote', portStream)
    onNewConnection(portStream)
  } else {
    const portStream = remoteStreams.get(port)
    if (!portStream) throw new Error('Message from unknown source...')
    // feed message into portStream
    portStream.push(messageEvent.data)
  }
})

function onNewConnection(remoteStream){
  console.log('got a remote connection!')
  remoteStream.on('data', (message) => {
    console.log(id, message)
    let newValue = message.value * 2
    remoteStream.write({ value: newValue })
  })
}


// self.onsync = function (syncEvent) {
// // What is done when a sync even is fired
// // some things could be like:
// /*
// what is the current state
// or just be all like hay data changed
// "i'm responsible for passing data back and forth"

// things achieved here:
// */
//   var focused
//   self.clients.matchAll()
//   .then(clients => {
//     clients.forEach(function(client) {
//       if (client.focused) {
//         focused = true
//         return sendMessageToClient(client, 'sync Received')
//         .then(clientInfo => {
//           debugger
//         })
//       } else {
//         sendMessageToClient(client, 'not focused')
//       }
//     })
//     if (!focused) {sendMessageToAllClients('no focus')}
//   })
// }

// function sendMessageToClient(client, msg, data){
//     return new Promise(function(resolve, reject){
//         var msgChan = new MessageChannel()
//         msgChan.port1.onmessage = function(event){
//             if(event.data.error){
//                 reject(event.data.error)
//             }else{
//                 resolve(event.data)
//             }
//         }

//         client.postMessage({
//           message: 'SW Says',
//           full: `${id}SW Says: ${msg}`,
//           data: data,
//         }, [msgChan.port2])
//     })
// }
// function sendMessageToAllVisibleClients (message, data) {
//   self.clients.matchAll().then(function(clients) {
//     clients.forEach(function(client) {
//       if (client.visibilityState === 'visible') {
//         client.postMessage({message, data})
//       }
//     })
//   })
// }

// function sendMessageToAllClients (message) {
//   self.clients.matchAll().then(function(clients) {
//     clients.forEach(function(client) {
//       client.postMessage(message)
//     })
//   })
// }


