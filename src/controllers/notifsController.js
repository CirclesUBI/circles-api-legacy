const HttpStatus = require('http-status-codes')
const Notification = require('../models/notification');
const logger = require('../lib/logger');

async function all (req, res) {
  try {
    const notifications = await Notification.query().limit(10)
    res.status(HttpStatus.OK).send(notifications)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

module.exports = {all}
