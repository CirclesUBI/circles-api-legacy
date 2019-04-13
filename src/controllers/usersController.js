const PostgresDB = require('../database').postgresDB
const User = require('../models/user')
const logger = require('../lib/logger')
const cognitoISP = require('../connections/cognito')
const { recoverAddress } = require('../connections/blockchain')
const sns = require('../connections/sns')
const convertCognitoToCirclesUser = require('../lib/convertCognitoToCirclesUser')

async function all (req, res) {
  try {
    const users = await User.query()
    if (!users.length) return res.sendStatus(404)
    res.status(200).send(users)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function own (req, res) {
  try {
    const user = await User.query()
      .where({ id: res.locals.user.sub })
      .first()
    if (!user) res.sendStatus(404)
    res.status(200).send(user)
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
    if (!user) return res.sendStatus(404)

    await user.$relatedQuery('notifications')
    await user.$relatedQuery('offers')
    await user.$relatedQuery('organizations')
    res.status(200).send(user)
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
    if (user) res.sendStatus(400)

    const endpointArn = await sns.createSNSEndpoint(circlesUser)
    circlesUser.device_endpoint = endpointArn
    await cognitoISP.addToCognitoGroup(circlesUser)
    user = await User.query(trx).insert(circlesUser)
    await trx.commit()
    res.status(201).send(user)
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.sendStatus(500)
  }
}

async function addOwn (req, res) {
  if (req.body.sub !== res.locals.user.sub) return res.sendStatus(403)

  let user
  const trx = await PostgresDB.startTransaction()
  try {
    const circlesUser = convertCognitoToCirclesUser(req.body)
    user = await User.query(trx)
      .where({ id: circlesUser.id })
      .first()
    if (user) return res.status(200).send(user)

    const endpointArn = await sns.createSNSEndpoint(circlesUser)
    circlesUser.device_endpoint = endpointArn
    await cognitoISP.addToCognitoGroup(circlesUser)
    user = await User.query(trx).insert(circlesUser)
    await trx.commit()
    res.status(201).send(user)
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.sendStatus(500)
  }
}

async function updateOne (req, res) {
  let user
  try {
    user = await User.query()
      .where({ id: req.params.id })
      .first()
    if (!user) return res.sendStatus(404)

    user = await User.query().patchAndFetchById(req.params.id, req.body)
    res.status(200).send(user)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function updateOwn (req, res) {
  let user
  try {
    user = await User.query()
      .where({ id: res.locals.user.sub })
      .first()
    if (!user) return res.sendStatus(404)

    user = await User.query().patchAndFetchById(res.locals.user.sub, req.body)
    res.status(200).send(user)
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
    if (!user) return res.sendStatus(404)

    await user
      .$relatedQuery('organizations')
      .delete()
      .where({ owner_id: res.locals.user.sub })
    await User.query(trx)
      .delete()
      .where({ id: req.params.id })
    await trx.commit()
    res.status(200).send()
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
      .where({ id: res.locals.user.sub })
      .first()
    if (!user) return res.sendStatus(404)

    await user
      .$relatedQuery('organizations')
      .delete()
      .where({ owner_id: res.locals.user.sub })
    await User.query(trx)
      .delete()
      .where({ id: res.locals.user.sub })
    await trx.commit()
    res.status(200).send()
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.sendStatus(500)
  }
}

async function recoverAccount (req, res) {
  try {
    // todo: add security
    console.log('req.body', req.body)
    const walletAddress = await recoverAddress(
      req.body.message,
      req.body.signature
    )
    logger.info('walletAddress: ' + walletAddress)

    const user = await User.query()
      .where({ wallet_address: walletAddress })
      .first()
    if (!user) return res.sendStatus(404)

    await user.$relatedQuery('notifications')
    await user.$relatedQuery('offers')
    await user.$relatedQuery('organizations')

    console.log(
      'device_id',
      user.device_id === req.body.device_id,
      user.device_id,
      req.body.device_id
    )
    console.log(
      'device_endpoint',
      user.device_endpoint === req.body.device_endpoint,
      user.device_endpoint,
      req.body.device_endpoint
    )
    console.log(
      'phone number',
      user.phone_number === req.body.phone_number,
      user.phone_number,
      req.body.phone_number
    )

    const endpointData = await sns.getSNSEndpoint(user.device_endpoint)

    console.log('endpointData', endpointData.toJson())

    if (
      user.device_id !== endpointData.Attributes.Token ||
      !endpointData.Attributes.Enabled
    ) {
      // update sns endpoint with new device token
      const endpointArn = await sns.updateSNSEndpoint(
        user.device_endpoint,
        req.body.device_id
      )
      logger.info('endpointArn ' + endpointArn)
      // update cognito with new phone number and trigger verification
      const res = await cognitoISP.updatePhone(
        user.username,
        req.body.phone_number
      )
      logger.info('updatePhone ' + res)

      user = await user.patchAndFetchById(user.id, {
        phone_number: req.body.phone_number || user.phone_number,
        device_endpoint: endpointArn
      })
      logger.info('user ' + user)
    }
    res.status(200).send(user)
  } catch (error) {
    logger.error(error.message)
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
  deleteOwn,
  recoverAccount
}
