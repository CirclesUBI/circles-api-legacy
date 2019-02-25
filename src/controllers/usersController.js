const PostgresDB = require('../database').postgresDB
const User = require('../models/user')
const logger = require('../lib/logger')
const cognitoISP = require('../connections/cognito')
const sns = require('../connections/sns')
const convertCognitoToCirclesUser = require('../lib/convertCognitoToCirclesUser')

async function all (req, res) {
  try {
    const users = await User.query()
    if (!users.length) {
      res.sendStatus(404)
    } else {
      res.status(200).send(users)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function own (req, res) {
  try {
    const user = await User.query()
      .where({ id: res.locals.user.username })
      .first()
    if (!user) {
      res.sendStatus(404)
    } else {
      res.status(200).send(user)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function findOne (req, res) {
  try {
    const user = await User.query()
      .where({ id: req.params.id })
      .first()
    if (!user) {
      res.sendStatus(404)
    } else {
      user.notifications = await user.$relatedQuery('notifications')
      user.offers = await user.$relatedQuery('offers')
      user.organizations = await user.$relatedQuery('organizations')
      res.status(200).send(user)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function addOne (req, res) {
  let user
  const trx = await PostgresDB.startTransaction()
  try {
    const circlesUser = convertCognitoToCirclesUser(req.body)
    user = await User.query(trx)
      .where({ id: circlesUser.id })
      .first()
    if (user) {
      // User already exists
      res.sendStatus(400)
    } else {
      const endpointArn = await sns.createSNSEndpoint(circlesUser)
      circlesUser.device_endpoint = endpointArn
      await cognitoISP.addToCognitoGroup(circlesUser)
      user = await User.query(trx).insert(circlesUser)
      await trx.commit()
      res.status(201).send(user)
    }
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.sendStatus(500)
  }
}

async function addOwn (req, res) {
  if (req.body.id !== res.locals.user.username) {
    res.sendStatus(403)
  } else {
    let user
    const trx = await PostgresDB.startTransaction()
    try {
      const circlesUser = convertCognitoToCirclesUser(req.body)
      user = await User.query(trx)
        .where({ id: circlesUser.id })
        .first()
      if (user) {
        // User already exists
        res.sendStatus(400)
      } else {
        const endpointArn = await sns.createSNSEndpoint(circlesUser)
        circlesUser.device_endpoint = endpointArn
        await cognitoISP.addToCognitoGroup(circlesUser)
        user = await User.query(trx).insert(circlesUser)
        await trx.commit()
        res.status(201).send(user)
      }
    } catch (error) {
      logger.error(error.message)
      await trx.rollback()
      res.sendStatus(500)
    }
  }
}

async function updateOne (req, res) {
  let user
  try {
    user = await User.query()
      .where({ id: req.params.id })
      .first()
    if (!user) {
      // User already exists
      res.sendStatus(404)
    } else {
      user = await User.query().patchAndFetchById(req.params.id, req.body)
      res.status(200).send(user)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function updateOwn (req, res) {
  let user
  try {
    user = await User.query()
      .where({ id: res.locals.user.username })
      .first()
    if (!user) {
      // User already exists
      res.sendStatus(404)
    } else {
      user = await User.query().patchAndFetchById(
        res.locals.user.username,
        req.body
      )
      res.status(200).send(user)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function deleteOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const user = await User.query(trx)
      .where({ id: req.params.id })
      .first()
    if (!user) {
      res.sendStatus(404)
    } else {
      // await user.$relatedQuery('organizations').unrelate().where({ owner_id: res.locals.user.username })
      await user
        .$relatedQuery('organizations')
        .delete()
        .where({ owner_id: res.locals.user.username })
      // await user.$relatedQuery('notifications').delete().where({ owner_id: res.locals.user.username })
      // await user.$relatedQuery('offers').delete().where({ owner_id: res.locals.user.username })
      await User.query(trx)
        .delete()
        .where({ id: req.params.id })
      await trx.commit()
      res.status(200).send()
    }
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.sendStatus(500)
  }
}

async function deleteOwn (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const user = await User.query(trx)
      .where({ id: res.locals.user.username })
      .first()
    if (!user) {
      // User already exists
      res.sendStatus(404)
    } else {
      // await user.$relatedQuery('organizations').unrelate().where({ owner_id: res.locals.user.username })
      await user
        .$relatedQuery('organizations')
        .delete()
        .where({ owner_id: res.locals.user.username })
      // await user.$relatedQuery('notifications').delete().where({ owner_id: res.locals.user.username })
      // await user.$relatedQuery('offers').delete().where({ owner_id: res.locals.user.username })
      await User.query(trx)
        .delete()
        .where({ id: res.locals.user.username })
      await trx.commit()
      res.status(200).send()
    }
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.sendStatus(500)
  }
}

module.exports = {
  all,
  own,
  findOne,
  addOne,
  addOwn,
  updateOne,
  updateOwn,
  deleteOne,
  deleteOwn
}
