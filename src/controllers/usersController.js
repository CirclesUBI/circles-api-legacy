const HttpStatus = require('http-status-codes')
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
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    res.status(HttpStatus.OK).send(users)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function own (req, res) {
  try {
    const user = await User.query()
      .where({ id: res.locals.user.username })
      .first()
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    res.status(HttpStatus.OK).send(user)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function findOne (req, res) {
  try {
    const user = await User.query()
      .where({ id: req.params.id })
      .first()
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    user.notifications = await user.$relatedQuery('notifications')
    user.offers = await user.$relatedQuery('offers')
    user.organizations = await user.$relatedQuery('organizations')
    res.status(HttpStatus.OK).send(user)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
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
      res.status(HttpStatus.BAD_REQUEST).send({
        error: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
      })
    }
    const endpointArn = await sns.createSNSEndpoint(circlesUser)
    circlesUser.device_endpoint = endpointArn
    await cognitoISP.addToCognitoGroup(circlesUser)
    user = await User.query(trx).insert(circlesUser)
    await trx.commit()
    res.status(HttpStatus.CREATED).send(user)
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function addOwn (req, res) {
  if (circlesUser.id !== res.locals.user.username) {
    res.status(HttpStatus.FORBIDDEN).send({
      error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
    })
  }
  let user
  const trx = await PostgresDB.startTransaction()
  try {
    const circlesUser = convertCognitoToCirclesUser(req.body)
    user = await User.query(trx)
      .where({ id: circlesUser.id })
      .first()
    if (user) {
      // User already exists
      res.status(HttpStatus.BAD_REQUEST).send({
        error: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
      })
    }
    const endpointArn = await sns.createSNSEndpoint(circlesUser)
    circlesUser.device_endpoint = endpointArn
    await cognitoISP.addToCognitoGroup(circlesUser)
    user = await User.query(trx).insert(circlesUser)
    await trx.commit()
    res.status(HttpStatus.CREATED).send(user)
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function updateOne (req, res) {
  let user
  try {
    user = await User.query(trx)
      .where({ id: circlesUser.id })
      .first()
    if (!user) {
      // User already exists
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    user = await User.query().patchAndFetchById(req.params.id, req.body)
    res.status(HttpStatus.OK).send(user)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function updateOwn (req, res) {
  let user
  try {
    user = await User.query(trx)
      .where({ id: res.locals.user.username })
      .first()
    if (!user) {
      // User already exists
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    user = await User.query().patchAndFetchById(
      res.locals.user.username,
      req.body
    )
    res.status(HttpStatus.OK).send(user)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function deleteOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const user = await User.query(trx)
      .where({ id: req.params.id })
      .first()
    if (!user) {
      // User already exists
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }

    await user.$relatedQuery('organizations').delete()
    await user.$relatedQuery('notifications').delete()
    await user.$relatedQuery('offers').delete()
    await User.query(trx)
      .delete()
      .where({ id: req.params.id })
    await trx.commit()
    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
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
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    await user.$relatedQuery('organizations').delete()
    await user.$relatedQuery('notifications').delete()
    await user.$relatedQuery('offers').delete()
    await User.query(trx)
      .delete()
      .where({ id: res.locals.user.username })
    await trx.commit()
    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
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
