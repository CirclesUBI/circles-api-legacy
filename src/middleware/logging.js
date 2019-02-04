const logger = require('../lib/logger');

const loggingMiddleware = (req, res, next) => {  
  logger.info('[' + req.method + '] ' + req.url)
  next()
}

module.exports = loggingMiddleware
