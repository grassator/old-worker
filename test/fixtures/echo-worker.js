// this worker just sends back whatever it receives
self.onmessage = function(e) {
    self.postMessage(e.data);
};
