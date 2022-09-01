
const { Logger } = require('@util/logger.js');
var { responseBuilder }  = require('@util/response.js');
const { BackendPerformanceTracker } = require('@util/perf.js');

module.exports.helloHandler = function(req,res,serviceName) {
    Logger.info("recv hello request");
    BackendPerformanceTracker.addHit(serviceName)
    var responsePayload = responseBuilder(req);
    responsePayload['message']="hello";
    res.json(responsePayload);
    Logger.info("sent "+serviceName+" response to client from "+responsePayload.request_source_ip);
}

