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

// app 
Logger.info("starting backend");
var app = express();

// exposed services
app.get('/health', healthProbeHandler)
app.get('/perfs',perfHandler)
app.get('/connectivity/local', (req,res) => helloHandler(req,res,"connectivity/local") );
app.get('/connectivity/spoke', (req,res) => forwardCallHandler(req,res,"connectivity/spoke",forwardSpokeUrl,"spoke"));
app.get('/connectivity/onprem', (req,res) => forwardCallHandler(req,res,"connectivity/onprem",forwardOnPremUrl,"onprem"));
app.get('/connectivity/public', (req,res) => githubForwarder(req,res,"connectivity/public")); 

app.listen(appPort);
Logger.info("backend started, listening on port="+appPort);
