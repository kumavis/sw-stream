const SwController = require('./sw-controller')
var serviceWorkerController
window.onload = function () {
  serviceWorkerController = new SwController()
  serviceWorkerController.on('error', showError)
  serviceWorkerController.on('message', showMessage)
  serviceWorkerController.on('data', showData)
  setupButton(serviceWorkerController)
}
function setupButton (sw) {
  var button = document.getElementById('button')
  button.addEventListener('click', sw.counter.bind(sw))
}


function showError (message) {
  var errContainer = document.getElementById('err')
  errContainer.style.background = ' #ffd6cc'
  errContainer.style.color = '#ff471a'
  errContainer.innerText = message
}

function showMessage (message) {
  var messageContainer = document.getElementById('message')
  messageContainer.innerText = message
}


function showData (data) {
  var dataContainer = document.getElementById('data')
  dataContainer.innerText = data
}
