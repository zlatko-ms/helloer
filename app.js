// dependencies
require('module-alias/register')
var express = require('express');

// modules
const { Logger } = require('@util/logger.js');
var { healthProbeHandler } = require('@handlers/health.js');
var { helloHandler } = require('@handlers//hello.js');
var { spokeForwarder, onpremForwarder } = require('@handlers/privateForwarders.js');
var { githubForwarder } = require('@handlers/githubForwarder.js');
//var { onpremForwarder } = require('@handlers/onpremForwarder.js');

// configuration
var { appPort } = require('@util/configuration.js');

// app 
Logger.info("starting backend");
var app = express();
app.get('/health', healthProbeHandler)
app.get('/connectivity/local', helloHandler);
app.get('/connectivity/spoke', spokeForwarder );
app.get('/connectivity/public', githubForwarder);
app.get('/connectivity/onprem', onpremForwarder);
app.listen(appPort);
Logger.info("backend started, listening on port="+appPort);
