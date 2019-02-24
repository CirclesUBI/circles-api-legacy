const HttpStatus = require('http-status-codes')
const PostgresDB = require('../database').postgresDB
const Organization = require('../models/organization')
const logger = require('../lib/logger')

async function all (req, res) {
  try {
    const organizations = await Organization.query().limit(10)
    res.status(HttpStatus.OK).send(organizations)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function allOwn (req, res) {
  try {
    const organizations = await Organization.query().where({
      owner_id: res.locals.user.username
    })
    res.status(HttpStatus.OK).send(organizations)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function findOne (req, res) {
  try {
    const result = await Organization.query().where({ id: req.params.id })
    const organization = result.length ? result[0] : null
    if (organization) {
      // organization.members = await organization.$relatedQuery('members')
      organization.offers = await organization.$relatedQuery('offers')
      organization.owner = await organization.$relatedQuery('owner')
    }
    res.status(HttpStatus.OK).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function findOwn (req, res) {
  try {
    const result = await Organization.query().where({
      id: req.params.id,
      owner_id: res.locals.user.username
    })
    const organization = result.length ? result[0] : null
    if (organization) {
      // organization.members = await organization.$relatedQuery('members')
      organization.offers = await organization.$relatedQuery('offers')
      organization.owner = await organization.$relatedQuery('owner')
    }
    res.status(HttpStatus.OK).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function addOne (req, res) {
  let organization
  try {
    const orgExists = await Organization.query().where({ id: req.body.id })
    if (orgExists.length) {
      throw new Error('Organization.id already exists: ' + req.body.id)
    } else {
      organization = await Organization.query().insert(req.body)
    }
    res.status(HttpStatus.OK).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function addOwn (req, res) {
  let organization
  try {
    if (req.body.owner_id !== res.locals.user.username) {
      throw new Error(
        `Not user ${res.locals.user.username} own org: ${req.body.id}`
      )
    }
    const orgExists = await Organization.query().where({ id: req.body.id })
    if (orgExists.length) {
      throw new Error('Organization.id already exists: ' + req.body.id)
    } else {
      organization = await Organization.query().insert(req.body)
    }
    res.status(HttpStatus.OK).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function updateOne (req, res) {
  let organization
  try {
    const orgExists = await Organization.query().where({ id: req.params.id })
    if (!orgExists.length) {
      throw new Error('Organization.id does not exist: ' + req.params.id)
    } else {
      organization = await Organization.query().patchAndFetchById(
        req.params.id,
        req.body
      )
    }
    res.status(HttpStatus.OK).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function updateOwn (req, res) {
  let organization
  try {
    const orgExists = await Organization.query().where({
      id: req.params.id,
      owner_id: res.locals.user.username
    })
    if (!orgExists.length) {
      throw new Error(
        `Organization.id ${
          req.params.id
        } does not exist or is not owned by User.id: ${
          res.locals.user.username
        }`
      )
    } else {
      organization = await Organization.query().patchAndFetchById(
        req.params.id,
        req.body
      )
    }
    res.status(HttpStatus.OK).send(organization)
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
    const organization = await Organization.query(trx)
      .where({ id: req.params.id })
      .first()
    if (organization) {
      // await organization.$relatedQuery('members').unrelate()
      // await organization.$relatedQuery('owner').unrelate()
      // await organization.$relatedQuery('offers').delete()
      // await organization.$relatedQuery('notifications').delete()
      await Organization.query(trx)
        .delete()
        .where({ id: req.params.id })
    } else {
      throw new Error('No Organization.id: ' + req.params.id)
    }
    await trx.commit()
    res.status(HttpStatus.OK).send(organization)
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
    const organization = await Organization.query(trx)
      .where({ id: req.params.id, owner_id: res.locals.user.username })
      .first()
    if (organization) {
      //await organization.$relatedQuery('owner').unrelate()
      //await organization.$relatedQuery('offers').delete()
      //await organization.$relatedQuery('notifications').delete()
      await Organization.query(trx)
        .delete()
        .where({ id: req.params.id })
    } else {
      throw new Error(
        `Organization.id ${
          req.params.id
        } does not exist or is not owned by User.id: ${
          res.locals.user.username
        }`
      )
    }
    await trx.commit()
    res.status(HttpStatus.OK).send(organization)
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
