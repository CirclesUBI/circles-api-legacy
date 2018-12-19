import logger from '../lib/logger'

const loggingMiddleware = (req, res, next) => {  
  let logString = '[' + req.method + '] ' + req.url
  logger.info(logString)
  next()
}

export default loggingMiddleware
