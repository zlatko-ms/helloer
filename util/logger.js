
/** logger setup */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

var { backendType } = require('@util/configuration.js')

//const mylogfileName = backendType+".log";

const myLoggerFormat = printf(({ level, message, label, timestamp }) => { return `${timestamp} [${level}] `+"("+backendType+")"+` ${message}`; });
const logger = createLogger( {
  format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss-SS'}),myLoggerFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: backendType+".log" })
  ]});

module.exports.Logger = logger;
