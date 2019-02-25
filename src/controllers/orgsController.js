const PostgresDB = require('../database').postgresDB
const Organization = require('../models/organization')
const logger = require('../lib/logger')

async function all (req, res) {
  try {
    const organizations = await Organization.query()
    if (!organizations.length) {
      res.sendStatus(404)
    } else {
      res.status(200).send(organizations)
    }
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
    if (!organizations.length) {
      res.sendStatus(404)
    } else {
      res.status(200).send(organizations)
    }
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
    if (!organization) {
      res.sendStatus(404)
    } else {
      // organization.members = await organization.$relatedQuery('members')
      organization.offers = await organization.$relatedQuery('offers')
      organization.owner = await organization.$relatedQuery('owner')
      res.status(200).send(organization)
    }
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
    if (!organization) {
      res.sendStatus(404)
    } else if (organization.owner_id !== res.locals.user.username) {
      res.sendStatus(403)
    } else {
      // organization.members = await organization.$relatedQuery('members')
      organization.offers = await organization.$relatedQuery('offers')
      organization.owner = await organization.$relatedQuery('owner')
      res.status(200).send(organization)
    }
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
    if (organization) {
      // Organization already exists
      res.sendStatus(400)
    } else {
      organization = await Organization.query().insert(req.body)
      res.status(201).send(organization)
    }
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function addOwn (req, res) {
  if (req.body.owner_id !== res.locals.user.username) {
    res.sendStatus(403)
  } else {
    let organization
    try {
      organization = await Organization.query()
        .where({ id: req.body.id })
        .first()
      if (organization) {
        // Organization already exists
        res.sendStatus(400)
      } else {
        organization = await Organization.query().insert(req.body)
        res.status(201).send(organization)
      }
    } catch (error) {
      logger.error(error.message)
      res.sendStatus(500)
    }
  }
}

async function updateOne (req, res) {
  let organization
  try {
    organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) {
      res.sendStatus(404)
    } else {
      organization = await Organization.query().patchAndFetchById(
        req.params.id,
        req.body
      )
      res.status(200).send(organization)
    }
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
    if (!organization) {
      res.sendStatus(404)
    } else if (organization.owner_id !== res.locals.user.username) {
      res.sendStatus(403)
    } else {
      organization = await Organization.query().patchAndFetchById(
        req.params.id,
        req.body
      )
      res.status(200).send(organization)
    }
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
    if (!organization) {
      res.sendStatus(404)
    } else {
      // await organization.$relatedQuery('members').unrelate()
      // await organization.$relatedQuery('owner').unrelate()
      // await organization.$relatedQuery('offers').delete()
      // await organization.$relatedQuery('notifications').delete()
      // console.log('here right')
      // let a = await organization.$relatedQuery('owner').unrelate() //.where({ owner_id: res.locals.user.username })
      // console.log('a', a)
      // let b = await organization.$relatedQuery('offers').delete().where({ owner_id: req.params.id })
      // console.log('b', b)
      // let c = await organization.$relatedQuery('notifications').delete().where({ owner_id: req.params.id })
      // console.log('c', c)
      let d = await Organization.query(trx)
        .delete()
        .where({ id: req.params.id })
      console.log('d', d)
      await trx.commit()
      res.status(200).send(organization)
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
    const organization = await Organization.query()
      .where({ id: req.params.id })
      .first()
    if (!organization) {
      res.sendStatus(404)
    } else if (organization.owner_id !== res.locals.user.username) {
      res.sendStatus(403)
    } else {
      // console.log(typeof organization.owner_id, organization.owner_id)
      // let a = await organization.$relatedQuery('owner').unrelate().where({ id: res.locals.user.username })
      // console.log('a', a)
      // let b = await organization.$relatedQuery('offers').delete().where({ owner_id: req.params.id })
      // console.log('b', b)
      // let c = await organization.$relatedQuery('notifications').delete().where({ owner_id: req.params.id })
      // console.log('c', c)
      let d = await Organization.query(trx)
        .delete()
        .where({ id: req.params.id })
      console.log('d', d)
      await trx.commit()
      res.status(200).send(organization)
    }
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
