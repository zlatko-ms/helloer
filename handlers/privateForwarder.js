const { Logger } = require('../util/logger.js');
var { responseBuilder }  = require('../util/response.js');
const url= require('url');
const axios = require('axios');

const privateForwardedUrl = process.env.HELLOER_FORWARD_PRIVATE_URL || "http://localhost:8080/connectivity/local";


module.exports.privateForwarder = function (req,res) {

    Logger.info("recv private forwarding request, using private endpoint "+privateForwardedUrl);
    var responsePayload=responseBuilder(req);

    axios.get(privateForwardedUrl).then(resAxios => {
        responsePayload["spoke_status"]="success";
        responsePayload["spoke_response"]=resAxios.data;
        res.json(responsePayload);
        Logger.info("sent response from spoke relay");
      })
      .catch(err => {
        Logger.error("error while fetching data from relay server " + err);
        responsePayload["spoke_status"]="error";
        responsePayload["spoke_response"]=err;
        res.status(500).json(responsePayload);
      });
};