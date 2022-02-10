
const { v4: uuidv4 } = require('uuid');

const myBackendType = process.env.HELLOER_BACKEND_TYPE || "helloer";
const myBackendId = process.env.HELLOER_BACKEND_ID || uuidv4();

module.exports.responseBuilder = function(req) {
    var sourceIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "unknown" ;
    var respTime = new Date().toISOString();
    var respId = uuidv4();
  
    var responsePayload = { 
      'backend-id' : myBackendType+"-"+ myBackendId,
      'request-source-ip' : sourceIp,
      'response-id' : respId, 
      'response-date': respTime 
    };

    return responsePayload;
}
