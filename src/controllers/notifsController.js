import * as HttpStatus from 'http-status-codes';
import PostgresDB from '../database'

import logger from '../lib/logger'

async function all (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const notifications = await trx.select('*').from('notification').limit(10)
    await trx.commit()
    res.status(HttpStatus.OK).send(notifications)
  } catch (error) {
    logger.error(error)
    await trx.rollback()
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

export default {all}
