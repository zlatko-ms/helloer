
const { v4: uuidv4 } = require('uuid');

var { backendType, backendId } = require("@util/configuration.js")
module.exports.responseBuilder = function(req) {
    var sourceIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "unknown" ;
    var respTime = new Date().toISOString();
    var respId = uuidv4();
  
    var responsePayload = { 
      'backend_type' : backendType,
      'backend_id' : backendType+"-"+ backendId,
      'request_source_ip' : sourceIp,
      'response_id' : respId, 
      'response_date': respTime 
    };

    return responsePayload;
}

