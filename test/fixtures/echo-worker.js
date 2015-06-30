// this worker just sends back whatever it receives
self.addEventListener('message', function(e) {
    self.postMessage(e);
});
