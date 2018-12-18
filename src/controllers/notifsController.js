// import * as HttpStatus from 'http-status-codes';
// import { findUser, userValidator } from '../validators/userValidator';
import PostgresDB from '../database'
import Notification from '../models/notification'

async function all (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const notifications = await trx.select('*').from('notification').limit(10)
    await trx.commit()
    res.status(200).send(notifications)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

export default {all}
