const HttpStatus = require('http-status-codes')
const PostgresDB = require('../database').postgresDB
const User = require('../models/user')
const logger = require('../lib/logger')
const cognitoISP = require('../connections/cognito')
const sns = require('../connections/sns')
const convertCognitoToCirclesUser = require('../lib/convertCognitoToCirclesUser')
// const HubContract = require('../connections/blockchain').HubContract

async function all (req, res) {
  try {
    const users = await User.query().limit(10)
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
    const result = await User.query().where({ id: res.locals.user.username })
    const ownUser = result.length ? result[0] : null
    if (!ownUser) {
      throw new Error('users own record does not exist: ' + res.locals.user.username)
    }    
    res.status(HttpStatus.OK).send(ownUser)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function findOne (req, res) {
  try {
    const result = await User.query().where({ id: req.params.id })
    const user = result.length ? result[0] : null
    if (user instanceof User) {
      user.notifications = await user.$relatedQuery('notifications')
      user.offers = await user.$relatedQuery('offers')
      user.organizations = await user.$relatedQuery('organizations')
    }
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
    const userExists = await User.query(trx).where({ id: circlesUser.id })
    if (userExists.length) {
      throw new Error('user.id already exists: ' + circlesUser.id)
    } else {
      const endpointArn = await sns.createSNSEndpoint(circlesUser)
      circlesUser.device_endpoint = endpointArn
      await cognitoISP.addToCognitoGroup(circlesUser)
      user = await User.query(trx).insert(circlesUser)
    }
    await trx.commit()
    res.status(HttpStatus.OK).send(user)
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
    const userExists = await User.query().where({ id: req.params.id })
    if (!userExists.length) {
      throw new Error('user.id does not exist: ' + req.params.id)
    } else {
      user = await User.query().patchAndFetchById(req.params.id, req.body)
    }
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
    const userExists = await User.query().where({ id: res.locals.user.username })
    if (!userExists.length) {
      throw new Error('users own record does not exist: ' + res.locals.user.username)
    } else {
      user = await User.query().patchAndFetchById(res.locals.user.username, req.body)
    }
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
    if (user instanceof User) {
      // await user.$relatedQuery('organizations').unrelate()
      // await user.$relatedQuery('notifications').delete()
      // await user.$relatedQuery('offers').delete()
      await User.query(trx)
        .delete()
        .where({ id: req.params.id })
    } else {
      throw new Error('No user.id: ' + req.params.id)
    }
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
    if (user instanceof User) {
      await user.$relatedQuery('organizations').delete()
      await user.$relatedQuery('notifications').delete()
      await user.$relatedQuery('offers').delete()
      await User.query(trx)
        .delete()
        .where({ id: res.locals.user.username })
    } else {
      throw new Error('No user.id: ' + res.locals.user.username)
    }
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

module.exports = { all, own, findOne, addOne, updateOne, updateOwn, deleteOne, deleteOwn }
