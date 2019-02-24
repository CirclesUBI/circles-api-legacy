const HttpStatus = require('http-status-codes')
const Notification = require('../models/notification')
const logger = require('../lib/logger')

async function all (req, res) {
  try {
    const notifications = await Notification.query().limit()
    if (!notifications.length) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    res.status(HttpStatus.OK).send(notifications)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function allOwn (req, res) {
  try {
    const notifications = await Notification.query()
      .where({
        owner_id: res.locals.user.username
      })
      .limit(10)
    if (!notifications.length) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
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
    const notification = await Notification.query()
      .where({ id: req.params.id })
      .first()
    if (!notification) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
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
    notification = await Notification.query().insert(req.body)
    res.status(HttpStatus.CREATED).send(notification)
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
    notification = await Notification.query()
      .where({
        id: req.params.id
      })
      .first()
    if (!notification) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    notification = await Notification.query().patchAndFetchById(
      req.params.id,
      req.body
    )
    res.status(HttpStatus.OK).send(notification)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function updateOwn (req, res) {
  let notification
  try {
    notification = await Notification.query()
      .where({
        id: req.params.id
      })
      .first()
    if (!notification) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    } else if (notification.owner_id !== res.locals.user.username) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
    notification = await Notification.query().patchAndFetchById(
      req.params.id,
      req.body
    )
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
    if (!notification) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    await Notification.query()
      .delete()
      .where({ id: req.params.id })

    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function deleteOwn (req, res) {
  try {
    const notification = await Notification.query()
      .where({ id: req.params.id })
      .first()
    if (!notification) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    } else if (notification.owner_id !== res.locals.user.username) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
    await Notification.query()
      .delete()
      .where({ id: req.params.id })
    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

module.exports = {
  all,
  allOwn,
  findOne,
  addOne,
  updateOne,
  updateOwn,
  deleteOne,
  deleteOwn
}
