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

async function findOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    let result = await Notification.query(trx).where({ id: req.params.id })
    let notification = (result.length) ? result[0] : null
    await trx.commit()
    res.status(200).send(notification)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

async function addOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const orgExists = await Notification.query(trx).where({ id: req.params.id })
    if (orgExists.length) throw new Error('notification.id exists: ' + req.params.id)
    const newNotification = await Notification.query(trx).insert(req.body)
    await trx.commit()
    res.status(200).send(newNotification)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

async function updateOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const patchedNotification = await Notification.query(trx).patchAndFetchById(req.params.id, req.body)
    await trx.commit()
    res.status(200).send(patchedNotification)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

async function deleteOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const result = await Notification.query(trx).delete().where({ id: req.params.id })
    if (!result) throw new Error('No notification.id: ' + req.params.id)
    await trx.commit()
    res.status(200).send()
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

export default {all, findOne, addOne, updateOne, deleteOne}
