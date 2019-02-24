const HttpStatus = require('http-status-codes')
const PostgresDB = require('../database').postgresDB
const Organization = require('../models/organization')
const logger = require('../lib/logger')

async function all (req, res) {
  try {
    const organizations = await Organization.query().limit(10)
    if (!organizations.length) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
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
    if (!organizations.length) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
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
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    // organization.members = await organization.$relatedQuery('members')
    organization.offers = await organization.$relatedQuery('offers')
    organization.owner = await organization.$relatedQuery('owner')
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
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    } else if (organization.owner_id !== res.locals.user.username) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
    // organization.members = await organization.$relatedQuery('members')
    organization.offers = await organization.$relatedQuery('offers')
    organization.owner = await organization.$relatedQuery('owner')
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
    const organization = await Organization.query()
      .where({ id: req.body.id })
      .first()
    if (organization) {
      // Organization already exists
      res.status(HttpStatus.BAD_REQUEST).send({
        error: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
      })
    }
    organization = await Organization.query().insert(req.body)
    res.status(HttpStatus.CREATED).send(organization)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function addOwn (req, res) {
  if (req.body.owner_id !== res.locals.user.username) {
    res.status(HttpStatus.FORBIDDEN).send({
      error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
    })
  }
  let organization
  try {
    organization = await Organization.query().where({ id: req.body.id })
    if (organization) {
      // Organization already exists
      res.status(HttpStatus.BAD_REQUEST).send({
        error: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
      })
    }
    organization = await Organization.query().insert(req.body)
    res.status(HttpStatus.CREATED).send(organization)
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
    organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    organization = await Organization.query().patchAndFetchById(
      req.params.id,
      req.body
    )

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
    organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    } else if (organization.owner_id !== res.locals.user.username) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
    organization = await Organization.query().patchAndFetchById(
      req.params.id,
      req.body
    )
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
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    // await organization.$relatedQuery('members').unrelate()
    // await organization.$relatedQuery('owner').unrelate()
    // await organization.$relatedQuery('offers').delete()
    // await organization.$relatedQuery('notifications').delete()
    await Organization.query(trx)
      .delete()
      .where({ id: req.params.id })
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
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    } else if (organization.owner_id !== res.locals.user.username) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
    //await organization.$relatedQuery('owner').unrelate()
    //await organization.$relatedQuery('offers').delete()
    //await organization.$relatedQuery('notifications').delete()
    await Organization.query(trx)
      .delete()
      .where({ id: req.params.id })
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
