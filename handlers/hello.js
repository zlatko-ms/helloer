
const { Logger } = require('@util/logger.js');
var { responseBuilder }  = require('@util/response.js');

module.exports.helloHandler = function(req,res) {
    Logger.info("recv hello request");
    var responsePayload = responseBuilder(req);
    responsePayload['message']="hello";
    res.json(responsePayload);
    Logger.info("sent hello response to client from "+responsePayload.request_source_ip);
}

