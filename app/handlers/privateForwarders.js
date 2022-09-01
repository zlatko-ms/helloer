const { Logger } = require('@util/logger.js');
var { responseBuilder }  = require('@util/response.js');
const axios = require('axios');
const { BackendPerformanceTracker } = require('@util/perf.js');

module.exports.forwardCallHandler = function(req,res,serviceName,forwardUrl,label) {

    Logger.info("recv private forwarding request, using private endpoint "+forwardUrl);
    
    var responsePayload=responseBuilder(req);
    BackendPerformanceTracker.addHit(serviceName);

    axios.get(forwardUrl).then(resAxios => {
        responsePayload[label+"_status"]="success";
        responsePayload[label+"_response"]=resAxios.data;
        res.json(responsePayload);
        Logger.info("sent aggregated response from "+label+" relay");
      })
      .catch(err => {
        Logger.error("error while fetching data from relay server " + err);
        responsePayload[label+"_status"]="error";
        responsePayload[label+"_response"]=err;
        res.status(500).json(responsePayload);
      });

};


