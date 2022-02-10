

const { Logger } = require('../util/logger.js');
var { responseBuilder }  = require('../util/response.js');

module.exports.healthProbeHandler = function(req,res) {
    Logger.info("recv probe request");
    var responsePayload = responseBuilder(req);
    responsePayload['status']="healthy";
    res.json(responsePayload);
    Logger.info("sent probe response to client from "+responsePayload['request-source-ip']);
}

