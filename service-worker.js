var counter = 0;
self.clients.matchAll().then(function(clients) {
  clients.forEach(function(client) {
    console.log(client);
    client.postMessage('The service worker just started up.');
  });
});

self.onmessage = function (message) {
  switch (message.data) {
    case 'counter':
      ++counter;
      return message.ports[0].postMessage({
        err: null,
        data: counter
      })

    case 'hello love':
      return message.ports[0].postMessage({
        err: null,
        data: 'message received'
      })

    default:
      return message.ports[0].postMessage({
        err: `no message under that name`,
      })
  }
};
self.addEventListener('periodicsync', function(event) {
  if (event.registration.tag == 'get-latest-news') {
    event.waitUntil(fetchAndCacheLatestNews());
  }
  else {
    // unknown sync, may be old, best to unregister
    event.registration.unregister();
  }
});
/*
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
*/
self.oninstall = function (event) {
  // cache the state of the app and ui so that
  // you can restart
  // in the right place
  // event.waitUntil(self.skipWaiting());
  // where you could posibly hault all things so
  // that the service worker can update
}

self.onsync = function (syncEvent) {
// What is done when a sync even is fired
// some things could be like:
/*
what is the current state
or just be all like hay data changed
"i'm responsible for passing data back and forth"

things achieved here:
*/
};
