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
    const now = Date.now()
    // if timestamp message is more than 2.5 minutes ago or more than 2.5 mins from now
    if (req.body.message < now - 150 || req.body.message > now + 150)
      return res.sendStatus(403)

    const walletAddress = await recoverAddress(
      req.body.message,
      req.body.signature
    )

    let user = await User.query()
      .where({ wallet_address: walletAddress })
      .first()
    if (!user) return res.sendStatus(404)

    let updateUserObj = {}

    try {
      const endpointData = await sns.getSNSEndpoint(user.device_endpoint)
      // Is it a new device?
      if (
        req.body.device_id !== endpointData.Attributes.Token ||
        !endpointData.Attributes.Enabled
      ) {
        // update sns endpoint with new device token
        const endpointArn = await sns.updateSNSEndpoint(
          user.device_endpoint,
          req.body.device_id
        )
        logger.debug('updating endpointArn ' + endpointArn)
        updateUserObj.device_endpoint = endpointArn
        updateUserObj.device_id = req.body.device_id
      }
    } catch (error) {
      // malformed endpoint or non-existent
      if (error.code === 'InvalidParameter' || error.code === 'NotFound') {
        logger.warn(
          '[' +
            error.code +
            '] on getSNSEndpoint() for user.id: ' +
            user.id +
            ' ... creating new endpoint'
        )
        try {
          user.device_id = req.body.device_id
          updateUserObj.device_endpoint = await sns.createSNSEndpoint(user)
          updateUserObj.device_id = req.body.device_id
        } catch (error) {
          throw error
        }
      } else {
        throw error
      }
    }

    // Is it a new phone number?
    if (user.phone_number !== req.body.phone_number) {
      // update cognito with new phone number and trigger verification
      const res = await cognitoISP.updatePhone(
        user.username,
        req.body.phone_number
      )
      logger.debug('updating phone_number ' + res)
      updateUserObj.phone_number = req.body.phone_number
    }

    if (Object.entries(updateUserObj).length !== 0)
      user = await User.query().patchAndFetchById(user.id, updateUserObj)

    await user.$relatedQuery('notifications')
    await user.$relatedQuery('offers')
    await user.$relatedQuery('organizations')
    res.status(200).send(user)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function getSuggestedContacts (req, res) {
  try {
    let contacts = JSON.parse(req.body.contacts)
    let numbers = contacts.map(contact => contact.number)
    const users = await User.query()
      .whereIn('phone_number', numbers)
      .andWhere('agreed_to_disclaimer', true)
    if (!users) return res.sendStatus(404)
    let suggestedNumbers = users.map(user => user.phone_number)
    let suggestedContacts = contacts.filter(contact =>
      suggestedNumbers.includes(contact.number)
    )
    res.status(200).send(suggestedContacts)
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
  recoverAccount,
  getSuggestedContacts
}
