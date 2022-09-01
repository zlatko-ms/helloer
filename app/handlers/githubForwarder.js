
const { Logger } = require('@util/logger.js');
var { responseBuilder }  = require('@util/response.js');
const url= require('url');
const axios = require('axios');
const { BackendPerformanceTracker } = require('@util/perf.js');
const githubUsername = process.env.HELLOER_FORWARDER_GITHUB_USERNAME || "funkomatic";

module.exports.githubForwarder = function (req,res,serviceName) {
 
    Logger.info("recv public forwarding request, retrieving "+githubUsername+" repos from github");

    var callUrl = "https://api.github.com/users/"+githubUsername+"/repos";
    var responsePayload=responseBuilder(req);

    BackendPerformanceTracker.addHit(serviceName)
    
    axios.get(callUrl).then(resAxios => {
      var repoCount = resAxios.data.length;
      var reposArray = [];
      for (var a=0;a<repoCount;a++) {
        var oneRepo = {
          'id' : resAxios.data[a].id,
          'name' : resAxios.data[a].name,
          'url' : resAxios.data[a].html_url
        };
        reposArray.push(oneRepo);
      }

      Logger.info("discovered "+reposArray.length+" repos for user "+githubUsername);
      responsePayload['public_status'] = "success";
      responsePayload['public_response'] = {
          'user' : githubUsername,
          'repos_count' : reposArray.length,
          'repos_list' : reposArray
      }

      res.json(responsePayload);
      Logger.info("sent public forwading request reply");
    })
    .catch(err => {
      Logger.error("error while fetching data from github " + err);
      responsePayload["public_status"]='error';
      responsePayload["public_response"]=err;
      res.status(500).json(responsePayload);
    });
};