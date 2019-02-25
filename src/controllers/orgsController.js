const PostgresDB = require('../database').postgresDB
const Organization = require('../models/organization')
const logger = require('../lib/logger')

async function all (req, res) {
  try {
    const organizations = await Organization.query()
    if (!organizations.length) return res.sendStatus(404)
    res.status(200).send(organizations)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function allOwn (req, res) {
  try {
    const organizations = await Organization.query().where({
      owner_id: res.locals.user.username
    })
    if (!organizations.length) return res.sendStatus(404)
    res.status(200).send(organizations)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function findOne (req, res) {
  try {
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) return res.sendStatus(404)

    await organization.$relatedQuery('offers')
    await organization.$relatedQuery('owner')
    res.status(200).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function findOwn (req, res) {
  try {
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) return res.sendStatus(404)
    else if (organization.owner_id !== res.locals.user.username)
      return res.sendStatus(403)

    await organization.$relatedQuery('offers')
    await organization.$relatedQuery('owner')
    res.status(200).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function addOne (req, res) {
  let organization
  try {
    organization = await Organization.query()
      .where({ id: req.body.id })
      .first()
    if (organization) res.sendStatus(400)

    organization = await Organization.query().insert(req.body)
    res.status(201).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function addOwn (req, res) {
  if (req.body.owner_id !== res.locals.user.username) return res.sendStatus(403)

  let organization
  try {
    organization = await Organization.query()
      .where({ id: req.body.id })
      .first()
    if (organization) return res.sendStatus(400)

    organization = await Organization.query().insert(req.body)
    res.status(201).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function updateOne (req, res) {
  let organization
  try {
    organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) res.sendStatus(404)

    organization = await Organization.query().patchAndFetchById(
      req.params.id,
      req.body
    )
    res.status(200).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function updateOwn (req, res) {
  let organization
  try {
    organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) return res.sendStatus(404)
    else if (organization.owner_id !== res.locals.user.username)
      return res.sendStatus(403)

    organization = await Organization.query().patchAndFetchById(
      req.params.id,
      req.body
    )
    res.status(200).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function deleteOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) return res.sendStatus(404)

    await Organization.query(trx)
      .delete()
      .where({ id: req.params.id })
    await trx.commit()
    res.status(200).send(organization)
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.sendStatus(500)
  }
}

async function deleteOwn (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) return res.sendStatus(404)
    else if (organization.owner_id !== res.locals.user.username)
      return res.sendStatus(403)
      
    await Organization.query(trx)
      .delete()
      .where({ id: req.params.id })
    await trx.commit()
    res.status(200).send(organization)
  } catch (error) {
    logger.error(error.message)
    await trx.rollback()
    res.sendStatus(500)
  }
}

module.exports = {
  all,
  allOwn,
  findOne,
  findOwn,
  addOne,
  addOwn,
  updateOne,
  updateOwn,
  deleteOne,
  deleteOwn
}
