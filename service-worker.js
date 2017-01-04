var counter = 0;
const version = 0.1;
sendMessageToAllClients('The service worker just started up.')

self.onmessage = function (message) {
  switch (message.data) {
    case 'counter':
      ++counter;
      sendMessageToAllVisibleClients('counter', counter)
      return message.ports[0].postMessage({
        err: null,
        data: counter
      })

    case 'get count':
      return message.ports[0].postMessage({
        err: null,
        data: counter
      })

    default:
      return message.ports[0].postMessage({
        err: `no message under that name`,
      })
  }
};

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.oninstall = function (event) {

  // cache the state of the app and ui so that
  // you can restart
  // in the right place
  event.waitUntil(self.skipWaiting());
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
  var focused
  self.clients.matchAll()
  .then(clients => {
    clients.forEach(function(client) {
      if (client.focused) {
        focused = true
        return sendMessageToClient(client, 'sync Received', counter)
        .then(clientInfo => {
          if (clientInfo.version > version) {
            debugger
            self.registration.update()
          }
        })
      } else {
        sendMessageToClient(client, 'not focused')
      }
    })
    if (!focused) {sendMessageToAllClients('no focus')}
  })
};

function sendMessageToClient(client, msg, data){
    return new Promise(function(resolve, reject){
        var msgChan = new MessageChannel();
        msgChan.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            }else{
                resolve(event.data);
            }
        };

        client.postMessage({
          message: `SW Says: ${msg}`,
          data: data
        }, [msgChan.port2]);
    });
}
function sendMessageToAllVisibleClients (message, data) {
  self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      if (client.visibilityState === 'visible') {
        client.postMessage({message, data});
      }
    });
  });
}

function sendMessageToAllClients (message) {
  self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      client.postMessage(message);
    });
  });
}


