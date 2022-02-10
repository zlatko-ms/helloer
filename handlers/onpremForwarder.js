const { Logger } = require('@util/logger.js');
var { responseBuilder }  = require('@util/response.js');
const url= require('url');
const axios = require('axios');

const privateForwardedUrl = process.env.HELLOER_FORWARD_ONPREM_URL || "http://my.host.is:9086/whatever";


module.exports.onpremForwarder = function (req,res) {

    Logger.info("recv onprem forwarding request, using private endpoint "+privateForwardedUrl);
    var responsePayload=responseBuilder(req);
    
    axios.get(privateForwardedUrl).then(resAxios => {
        responsePayload["onprem_status"]="success";
        responsePayload["onprem_response"]=resAxios.data;
        res.json(responsePayload);
        Logger.info("sent response for onprem relay");
      })
      .catch(err => {
        Logger.error("error while fetching data from onprem relay server " + err);
        responsePayload["onprem_status"]="error";
        responsePayload["onprem_response"]=err;
        res.status(500).json(responsePayload);
      });
};
