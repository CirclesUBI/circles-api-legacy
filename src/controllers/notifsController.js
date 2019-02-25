const Notification = require('../models/notification')
const logger = require('../lib/logger')

async function all (req, res) {
  try {
    const notifications = await Notification.query()
    if (!notifications.length) {
      res.sendStatus(404)
    } else {
      res.status(200).send(notifications)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function allOwn (req, res) {
  try {
    const notifications = await Notification.query().where({
      owner_id: res.locals.user.username
    })
    if (!notifications.length) {
      res.sendStatus(404)
    } else {
      res.status(200).send(notifications)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function findOne (req, res) {
  try {
    const notification = await Notification.query()
      .where({ id: req.params.id })
      .first()
    if (!notification) {
      res.sendStatus(404)
    } else {
      res.status(200).send(notification)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function addOne (req, res) {
  try {
    const notification = await Notification.query().insert(req.body)
    res.status(201).send(notification)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
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
      res.sendStatus(404)
    } else {
      notification = await Notification.query().patchAndFetchById(
        req.params.id,
        req.body
      )
      res.status(200).send(notification)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
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
      res.sendStatus(404)
    } else if (notification.owner_id !== res.locals.user.username) {
      res.sendStatus(403)
    } else {
      notification = await Notification.query().patchAndFetchById(
        req.params.id,
        req.body
      )
      res.status(200).send(notification)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function deleteOne (req, res) {
  try {
    const notification = await Notification.query()
      .where({ id: req.params.id })
      .first()
    if (!notification) {
      res.sendStatus(404)
    } else {
      await Notification.query()
        .delete()
        .where({ id: req.params.id })
      res.status(200).send()
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function deleteOwn (req, res) {
  try {
    const notification = await Notification.query()
      .where({ id: req.params.id })
      .first()
    if (!notification) {
      res.sendStatus(404)
    } else if (notification.owner_id !== res.locals.user.username) {
      res.sendStatus(403)
    } else {
      await Notification.query()
        .delete()
        .where({ id: req.params.id })
      res.status(200).send()
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
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
