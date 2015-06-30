import 'babel-core/polyfill';
/* global require:false */
var testsContext = require.context('./unit', true, /\.js$/);
testsContext.keys().forEach(testsContext);
