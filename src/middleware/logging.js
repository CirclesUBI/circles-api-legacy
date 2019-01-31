const logger = require('../lib/logger');

const loggingMiddleware = (req, res, next) => {  
  let logString = '[' + req.method + '] ' + req.url
  logger.info(logString)
  next()
}

module.exports = loggingMiddleware
