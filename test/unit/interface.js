import OldWorker from 'old-worker';
const NOOP_WORKER_URL = 'base/test/fixtures/noop-worker.js';

describe('interface', function () {

    it('should have correct number of arguments count', function () {
        assert.equal(OldWorker.length, 1);
    });

    it('should throw a TypeError if less than one argument provided', function () {
        assert.throws(function () {
            new OldWorker();
        }, TypeError);
    });

    it('should throw a DOMException if resolved URL violates same-origin policy', function () {
        assert.throws(function () {
            new OldWorker('http://everythingfrontend.com/foo.js');
        }, Error);
        assert.throws(function () {
            new OldWorker('//everythingfrontend.com/foo.js');
        }, Error);
        assert.throws(function () {
            new OldWorker(`https://${location.host}`);
        }, Error);
    });

    it('should allow to subscribe, dispatch and unsubscribe from events', function () {
        var worker = new OldWorker(NOOP_WORKER_URL);
        var called = 0;
        function listener() {
            ++called;
        }
        worker.addEventListener('myCustomEvent', listener);
        var e = { type: 'myCustomEvent' };
        worker.dispatchEvent(e);
        worker.removeEventListener('myCustomEvent', listener);
        e = { type: 'myCustomEvent' };
        worker.dispatchEvent(e);
        assert.equal(called, 1);
    });

    it('should have `onmessage` property callback', function () {
        var worker = new OldWorker(NOOP_WORKER_URL);
        var deliveredEvent;
        worker.onmessage = function(event) {
            deliveredEvent = event;
        };
        var e = { type: 'message' };
        worker.dispatchEvent(e);
        assert.equal(deliveredEvent, e);
    });

    describe('TODO', function () {
        this.pending = true;
        it('should have `onerror` property callback', function () {
            throw new Error();
        });
    });

});
