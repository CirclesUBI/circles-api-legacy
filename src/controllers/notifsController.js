import * as HttpStatus from 'http-status-codes';

import Notification from '../models/notification'

import logger from '../lib/logger'

async function all (req, res) {
  try {
    const notifications = await Notification.query().limit(10)
    res.status(HttpStatus.OK).send(notifications)
  } catch (error) {
    logger.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

export default {all}
