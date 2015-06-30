// this worker just sends an 'ok' message once loaded
window.parent.postMessage({ WORKER_ID: WORKER_ID, payload: 'ok'}, window.parent.location);
