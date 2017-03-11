# Notes for Service workers

[![Greenkeeper badge](https://badges.greenkeeper.io/kumavis/sw-stream.svg)](https://greenkeeper.io/)
Service Workers have a life cycle and are able to listen to events (via postMessage)

## Developing:
`npm run start`

## Expected flow:
`Dapp -> Iframe -> service worker`

## Important to Note

<!-- - Service only works for https -->
- APIs such as synchronous XHR and localStorage can't be used inside a service worker. (I)
- Service Workers will terminate if devtools are open for window
- A Service worker update may be installed but will wait to update until their in no clients using the service worker is open.
## Things to be done:

- [ ] Background synchronization re-write
- [ ] Reacting to Push messages
- [ ] !! Install Update

## Important reference links:

[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

[`ServiceWorkerContainer`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer)

[`ServiceWorkerRegistration`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration)

[`InstallEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent)

>The ServiceWorkerRegistration interface of
the ServiceWorker API represents the
service worker registration. You register
a service worker to control one or more
pages that share the same origin.



##debugging:
[chrome://serviceworker-internals/](chrome://serviceworker-internals/)

This will bring you to a list of service workers
where you can find a console to inspect and debug
the SW

other option is:
open chrome devtools click Application in the top bar and click `Service Workers` in the left hand menu

`Application > Service Workers`



## Frankie's File notes:

####navigator.serviceWorker.register(file, scope)
Service workers must be registered in seperate file (eg. index.js)

```js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' })
    .catch(function(err) {
      log('ServiceWorker failed to register. Are you visiting the HTTPS site?');
      log(err.message);
    });
  }
  ```

their seems to be a heavy reliance on promises

### Installing, Waiting, Updating and Unregistering

#### ServiceWorker.state
Returns the state of the service worker. It returns one of the following values: `installing`, `installed`, `activating`, `activated`, or `redundant`.

####ServiceWorkerRegistration.update()
`ServiceWorkerRegistration.update()` will check to see if their is a new version of the SW
>The update method of the
ServiceWorkerRegistration interface
attempts to update the service worker. It
fetches the worker's script URL, and if
the new worker is not byte-by-byte
identical to the current worker, it
installs the new worker. The fetch of the
worker bypasses any browser caches if the
previous fetch occurred over 24 hours ago.

Feature | Chrome |  Firefox (Gecko) | Internet Explorer | Opera | Safari (WebKit)
---|---|---|---|---|---
Basic support | 45.0 [1] [2]  | 44.0 (44.0)[3]  | No support | ? | No support
Available in web workers  | No support | 44.0 (44.0)[3] | No support | ? | No support

####ServiceWorkerRegistration.unregister()

>The unregister method of the
ServiceWorkerRegistration interface
unregisters the service worker
registration and returns a Promise. The
promise will resolve to false if no
registration was found, otherwise it
resolves to true irrespective of whether
unregistration happened or not (it may not unregister if someone else just called ServiceWorkerContainer.register with the
same scope.) The service worker will
finish any ongoing operations before it is unregistered.

example:
```js
ServiceWorkerRegistration.unregister().then(function(boolean) {
});
```


