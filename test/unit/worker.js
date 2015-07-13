import OldWorker from 'old-worker';
const OK_WORKER_URL = 'base/test/fixtures/ok-worker.js';
const ECHO_WORKER_URL = 'base/test/fixtures/echo-worker.js';

describe('worker', function () {

    it('should download and execute provided script', function (done) {
        var worker = new OldWorker(OK_WORKER_URL);
        worker.addEventListener('message', function (e) {
            assert.equal(e.data, 'ok');
            worker.terminate();
            done();
        });
    });

    it('should have a working postMessage inside', function (done) {
        var worker = new OldWorker(ECHO_WORKER_URL);
        worker.addEventListener('message', function (e) {
            assert.equal(e.data, 'ok');
            worker.terminate();
            done();
        });
        // FIXME add an event queue to OldWorker to avoid this setTimeout
        setTimeout(function () {
            worker.postMessage('ok');
        }, 50);
    });

});
