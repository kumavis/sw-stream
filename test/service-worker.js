const SwGlobalListener = require('../lib/sw-global-listener')
const swGlobal = self

// setup ServiceWorkerGlobal and capture clients

swGlobal.addEventListener('activate', function(event) {
  event.waitUntil(swGlobal.clients.claim())
})

swGlobal.oninstall = function (event) {
  event.waitUntil(swGlobal.skipWaiting())
}

// listen for clients

const connectionListener = new SwGlobalListener(swGlobal)

connectionListener.on('remote', (portStream, messageEvent) => {
  console.log('got a remote connection!')
  remoteStream.on('data', (message) => {
    console.log('message:', message)
    // example: double value and then send back
    let newValue = message.value * 2
    remoteStream.write({ value: newValue })
  })
})