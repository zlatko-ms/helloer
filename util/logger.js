
/** logger setup */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const mylogfileName = process.env.HELLOER_LOGFILE || "helloer.log";
const myLoggerFormat = printf(({ level, message, label, timestamp }) => { return `${timestamp} [${level}] ${message}`; });
const logger = createLogger( {
  format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss-SS'}),myLoggerFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: mylogfileName })
  ]});

module.exports.Logger = logger;
