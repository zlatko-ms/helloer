const { v4: uuidv4 } = require('uuid');

const confBackendType = process.env.HELLOER_BACKEND_TYPE || "helloer";
const confBackendId = process.env.HELLOER_BACKEND_ID || uuidv4();
const confAppPort = process.env.HELLOER_PORT || 8080;
const confUrlSpoke = process.env.HELLOER_FORWARD_PRIVATE_URL || "http://localhost:8080/connectivity/local";
const confUrlOnPrem = process.env.HELLOER_FORWARD_ONPREM_URL || "http://my.host.is:9086/whatever";
const confLogProbes = process.env.HELLOER_LOG_PROBES || "false"

module.exports.backendType = confBackendType;
module.exports.backendId = confBackendId;
module.exports.appPort = confAppPort;
module.exports.forwardSpokeUrl = confUrlSpoke;
module.exports.forwardOnPremUrl = confUrlOnPrem;
module.exports.logProbeCalls = Boolean(confLogProbes)

