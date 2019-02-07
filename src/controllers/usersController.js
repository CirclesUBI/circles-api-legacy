const HttpStatus = require('http-status-codes')
const PostgresDB = require('../database').postgresDB
const User = require('../models/user')
const logger = require('../lib/logger')
const cognitoISP = require('../connections/cognito')
const sns = require('../connections/sns')
// const HubContract = require('../connections/blockchain').HubContract

// todo: move this to FE (Sarah says this should become a utility in /lib)
function convertCognitoToUser (cognitoUser) {
  return {
    agreed_to_disclaimer: false,
    id: cognitoUser.sub,
    device_id: cognitoUser['custom:device_id'],
    email: cognitoUser.email,
    display_name: cognitoUser.name,
    phone_number: cognitoUser.phone_number,
    profile_pic_url: cognitoUser.picture
  }
}

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

async function findOne (req, res) {
  try {
    const result = await User.query().where({ id: req.params.id })
    const user = result.length ? result[0] : null
    if (user instanceof User) {
      user.notifications = await user.$relatedQuery('notifications')
      user.offers = await user.$relatedQuery('offers')
      user.organizations = await user.$relatedQuery('organizations')
    }
    res.status(HttpStatus.OK).send(user);
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
    const circlesUser = convertCognitoToUser(req.body)
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
    res.status(HttpStatus.OK).send(user);
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
      await user.$relatedQuery('organizations').unrelate()
      await user.$relatedQuery('notifications').delete()
      await user.$relatedQuery('offers').delete()
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

module.exports = {all, findOne, addOne, updateOne, deleteOne}
