// based on https://github.com/jugglinmike/srcdoc-polyfill
const setSrcDoc = (function () {
    if (Boolean('srcdoc' in document.createElement('iframe'))) {
        return function (iframe, content) {
            iframe.setAttribute('srcdoc', content);
        };
    }

    return function (iframe, content) {
        var jsUrl;
        if (!iframe || !iframe.getAttribute) {
            return;
        }

        if (!content) {
            content = iframe.getAttribute('srcdoc');
        } else {
            iframe.setAttribute('srcdoc', content);
        }

        if (content) {
            // The value returned by a script-targeted URL will be used as
            // the iFrame's content. Create such a URL which returns the
            // iFrame element's `srcdoc` attribute.
            jsUrl = 'javascript: window.frameElement.getAttribute("srcdoc");'; //eslint-disable-line

            iframe.setAttribute('src', jsUrl);

            // Explicitly set the iFrame's window.location for
            // compatability with IE9, which does not react to changes in
            // the `src` attribute when it is a `javascript:` URL, for
            // some reason
            if (iframe.contentWindow) {
                iframe.contentWindow.location = jsUrl;
            }
        }
    };
}());

const workers = {};
window.addEventListener('message', function (e) {
    var id = e.data.WORKER_ID;
    if (!id || !(id in workers)) {
        return;
    }
    switch (e.data.type) {
        case 'message':
            workers[id].dispatchEvent({ type: 'message', data: e.data.payload });
            break;
        default:
            break;
    }
}, false);

const scopeTemplate = `
(function (window) {
window.oldWorkerPostMessage = window.postMessage;
window.postMessage = function postMessage(payload) {
    window.parent.postMessage({ WORKER_ID: WORKER_ID, type: 'message', payload: payload }, window.parent.location);
};
window.onmessage = function (
    e,
    window, document, top, frames, parent, history, external, alert, open, prompt, confirm,
    moveTo, moveBy, screenTop, screenLeft, screenX, screenY, offsetHeight, offsetWidth,
    scrollX, scrollY, innerHeight, innerWidth, pageXOffset, pageXOffset
) {
    if (e.data.type !== 'WORKER_INIT') return;
    var self = this;
    this.onmessage = null;
    eval(e.data.scriptText);
}.bind(this);
}(this));
`;

function OldWorker(scriptURL) {
    if (arguments.length < 1) {
        throw new TypeError(`Failed to construct 'Worker': 1 argument required, but only 0 present.`);
    }
    var resolver = document.createElement('a');
    resolver.href = scriptURL;
    if (resolver.hostname !== location.hostname ||
        resolver.port !== location.port ||
        resolver.protocol !== location.protocol
    ) {
        // This should really be a DOMException, but you can't construct those yourself
        throw new URIError(
            `Failed to construct 'Worker': Script at '${resolver.href}'` +
            `cannot be accessed from origin '${location.protocol}//${location.host}'.`);
    }

    this.id = Math.floor(Math.random() * 10000);
    this.listeners = {};
    this.onmessage = null;
    this.onerror = null;
    workers[this.id] = this;

    this.iframe = document.createElement('iframe');
    this.iframe.style.position = 'absolute';
    this.iframe.style.top = '-100px';
    document.body.appendChild(this.iframe);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            this.postMessage({
                type: 'WORKER_INIT',
                scriptText: xhr.responseText
            });
        }
    }.bind(this);
    xhr.open('GET', resolver.href, true);
    xhr.send(null);

    setSrcDoc(
        this.iframe,
        `<script>WORKER_ID = ${this.id};</script><script>${scopeTemplate}</script>`
    );
}

OldWorker.prototype.postMessage = function postMessage(message) {
    this.iframe.contentWindow.oldWorkerPostMessage(message, '*');
};


OldWorker.prototype.terminate = function terminate() {
    if (!this.iframe) {
        return; // already terminated
    }
    delete workers[this.id];
    setSrcDoc(this.iframe, '');
    document.body.removeChild(this.iframe);
    this.iframe = null;
    this.listeners = [];
};

OldWorker.prototype.addEventListener = function addEventListener(event, callback) {
    if (!event || !callback) {
        return;
    }
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
};
OldWorker.prototype.removeEventListener = function removeEventListener(event, callback) {
    if (!event || !callback || !(event in this.listeners)) {
        return;
    }
    var index = this.listeners[event].indexOf(callback);
    if (index > -1) {
        this.listeners[event].splice(index, 1);
    }
};
OldWorker.prototype.dispatchEvent = function dispatchEvent(event) {
    if (!event || !event.type) {
        throw new TypeError('You need to provide a valid event for dispatchEvent call');
    }
    event.target = this;
    if (event.type === 'message' && typeof this.onmessage === 'function') {
        this.onmessage(event);
    }
    var listeners = this.listeners[event.type];
    if (!listeners || !listeners.length) {
        return;
    }
    for (var i = 0, length = listeners.length; i < length; ++i) {
        listeners[i].call(this, event);
    }
};

export default OldWorker;
