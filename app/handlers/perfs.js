const { Logger } = require('@util/logger.js');
const { forwardSpokeUrl, forwardOnPremUrl} = require('@util/configuration.js')
var { responseBuilder }  = require('@util/response.js');
const { BackendPerformanceTracker } = require('@util/perf.js');
const axios = require('axios');

module.exports.perfHandler= function(req,res) {
    Logger.info("recv hello request");
    var responsePayload = responseBuilder(req);


    responsePayload['perfs']= {
        'aggRps' : BackendPerformanceTracker.getAggRps(), 
        'services' :  BackendPerformanceTracker.getServiceBreakdown()
    }
    res.json(responsePayload);
    Logger.info("sent perf stats to client from "+responsePayload.request_source_ip);
}
