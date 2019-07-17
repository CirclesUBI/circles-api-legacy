const PostgresDB = require('../database').postgresDB
const User = require('../models/user')
const logger = require('../lib/logger')
const { cognito } = require('../connections/cognito')
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
    await cognito.addToCognitoGroup(circlesUser)
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
    await cognito.addToCognitoGroup(circlesUser)
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
  getSuggestedContacts
}
