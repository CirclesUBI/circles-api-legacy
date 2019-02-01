const HttpStatus = require('http-status-codes')
const Notification = require('../models/notification')
const logger = require('../lib/logger')

async function all (req, res) {
  try {
    const notifications = await Notification.query().limit(10)
    res.status(HttpStatus.OK).send(notifications)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function findOne (req, res) {
  try {
    const result = await Notification.query().where({ id: req.params.id })
    const notification = result.length ? result[0] : null
    res.status(HttpStatus.OK).send(notification)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function addOne (req, res) {
  let notification
  try {
    const notificationExists = await Notification.query().where({
      id: req.body.id
    })
    if (notificationExists.length) {
      throw new Error('notification.id already exists: ' + req.body.id)
    } else {
      notification = await Notification.query().insert(req.body)
    }
    res.status(HttpStatus.OK).send(notification)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function updateOne (req, res) {
  let notification
  try {
    const notificationExists = await Notification.query().where({
      id: req.params.id
    })
    if (!notificationExists.length) {
      throw new Error('notification.id does not exist: ' + req.params.id)
    } else {
      notification = await Notification.query().patchAndFetchById(
        req.params.id,
        req.body
      )
    }
    res.status(HttpStatus.OK).send(notification)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function deleteOne (req, res) {
  try {
    const notification = await Notification.query()
      .where({ id: req.params.id })
      .first()
    if (notification instanceof Notification) {
      await Notification.query()
        .delete()
        .where({ id: req.params.id })
    } else {
      throw new Error('No notification.id: ' + req.params.id)
    }
    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

module.exports = { all, findOne, addOne, updateOne, deleteOne }
