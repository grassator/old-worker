import OldWorker from 'old-worker';
const OK_WORKER_URL = 'base/test/fixtures/ok-worker.js';

describe('worker', function () {

    it('should download and execute provided script', function (done) {
        var worker = new OldWorker(OK_WORKER_URL);
        worker.addEventListener('message', function (e) {
            assert.equal(e.data, 'ok');
            worker.terminate();
            done();
        });
    });

});
