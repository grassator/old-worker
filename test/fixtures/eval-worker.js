self.onmessage = function(e) {
    self.postMessage(eval(e.data)); //eslint-disable-line no-eval
};
