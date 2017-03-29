# ServiceWorkerStream and ServiceWorkerGlobalListener

This a utility for creating streams between the page and a [servive worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

### usage

##### in page

pass the registered service worker to create a duplex stream.
```js
const duplex = SwStream({ serviceWorker: this.serviceWorker.controller })
```

There is an optional `context` property that will be passed along on the initial handshake and
retreivable from the `messageEvent.data.context` received from the SwGlobalListener.

```js
const duplex = SwStream({ serviceWorker, context })
```

##### in ServiceWorker

listen for client connections
```js
const connectionListener = new SwGlobalListener(self)

connectionListener.on('remote', (portStream, messageEvent) => {
  // ...
})
```