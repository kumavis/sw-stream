### ServiceWorkerStream and ServiceWorkerGlobalListener

This a utility for creating streams between the page and a [servive worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

### usage

in page: pass the registered service worker to create a duplex stream.
```js
const duplex = SwStream(this.serviceWorker.controller)
```

in ServiceWorker: listen for client connections
```js
const connectionListener = new SwGlobalListener(self)

connectionListener.on('remote', (portStream, messageEvent) => {
  // ...
})
```