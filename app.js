// dependencies
var express = require('express');
//const { response } = require('express');
const { Logger } = require('./util/logger.js');
var { healthProbeHandler } = require('./handlers/health.js');
var { helloHandler } = require('./handlers/hello.js');
var { privateForwarder } = require('./handlers/privateForwarder.js');
var { githubForwarder } = require('./handlers/githubForwarder.js');
var { onpremForwarder } = require('./handlers/onpremForwarder.js');
// params
const appPort = process.env.HELLOER_PORT || 8080;
// app 
Logger.info("starting backend");
var app = express();
app.get('/health', healthProbeHandler)
app.get('/connectivity/local', helloHandler);
app.get('/connectivity/spoke', privateForwarder );
app.get('/connectivity/public', githubForwarder);
app.get('/connectivity/onprem', onpremForwarder);
app.listen(appPort);
Logger.info("started backend on port="+appPort);
