

const { Logger } = require('@util/logger.js');
var { responseBuilder }  = require('@util/response.js');
const { logProbeCalls } = require('@util/configuration.js')

module.exports.healthProbeHandler = function(req,res) {
    if (logProbeCalls) {
        Logger.info("recv probe request");
    }
    var responsePayload = responseBuilder(req);
    responsePayload['status']="healthy";
    res.json(responsePayload);
    if (logProbeCalls) {
        Logger.info("sent probe response to client from "+responsePayload['request-source-ip']);
    }
}

