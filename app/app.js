// dependencies
require('module-alias/register')
var express = require('express');

// modules
const { Logger } = require('@util/logger.js');
var { healthProbeHandler } = require('@handlers/health.js');
var { helloHandler } = require('@handlers//hello.js');
var { forwardCallHandler } = require('@handlers/privateForwarders.js');
var { githubForwarder } = require('@handlers/githubForwarder.js');
var { perfHandler } = require('@handlers/perfs.js')

// configuration
var { appPort , forwardSpokeUrl, forwardOnPremUrl } = require('@util/configuration.js');

// service handler functions 
var handlerConnectivityLocal = function(req,res) { helloHandler(req,res,"connectivity/local") }
var handlerConnectivitySpoke = function(req,res) { forwardCallHandler(req,res,"connectivity/spoke",forwardSpokeUrl,"spoke")}
var handlerConnectivityOnPrem = function(req,res) { forwardCallHandler(req,res,"connectivity/onprem",forwardOnPremUrl,"onprem")}
var handlerConnectivityPublic = function(req,res) { githubForwarder(req,res,"connectivity/public") }

// app 
Logger.info("starting backend");
var app = express();

// url routing
app.get('/health', healthProbeHandler)
app.get('/perfs',perfHandler)
app.get('/connectivity/local', handlerConnectivityLocal);
app.get('/connectivity/spoke', handlerConnectivitySpoke );
app.get('/connectivity/onprem', handlerConnectivityOnPrem);
app.get('/connectivity/public', handlerConnectivityPublic);

app.listen(appPort);
Logger.info("backend started, listening on port="+appPort);
