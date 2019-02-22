const HttpStatus = require('http-status-codes')
const PostgresDB = require('../database').postgresDB
const Offer = require('../models/offer')
const logger = require('../lib/logger')

async function all (req, res) {
  try {
    const offers = await Offer.query().limit(25)
    res.status(HttpStatus.OK).send(offers)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function findOne (req, res) {
  try {
    const result = await Offer.query().where({ id: req.params.id })
    const offer = result.length ? result[0] : null
    res.status(HttpStatus.OK).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function addOne (req, res) {
  let offer
  try {
    offer = await Offer.query().insert(req.body)
    res.status(HttpStatus.OK).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function updateOne (req, res) {
  let offer
  try {
    const offerExists = await Offer.query().where({ id: req.params.id })
    if (!offerExists.length) {
      throw new Error('Offer.id does not exist: ' + req.params.id)
    } else {
      offer = await Offer.query().patchAndFetchById(req.params.id, req.body)
    }
    res.status(HttpStatus.OK).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function updateOwn (req, res) {
  let offer
  try {
    const offerExists = await Offer.query().where({
      id: req.params.id,
      owner_id: res.locals.user.username
    })
    if (!offerExists.length) {
      throw new Error(
        'Offer.id ' +
          req.params.id +
          ' does not exist or is not owned by: ' +
          res.locals.user.username
      )
    } else {
      offer = await Offer.query().patchAndFetchById(req.params.id, req.body)
    }
    res.status(HttpStatus.OK).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function deleteOne (req, res) {
  try {
    const offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (offer instanceof Offer) {
      await Offer.query()
        .delete()
        .where({ id: req.params.id })
    } else {
      throw new Error('Offer.id does not exist: ' + req.params.id)
    }
    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

async function deleteOwn (req, res) {
  try {
    const offer = await Offer.query()
      .where({ id: req.params.id, owner_id: res.locals.user.username })
      .first()
    if (offer instanceof Offer) {
      await Offer.query()
        .delete()
        .where({ id: req.params.id })
    } else {
      throw new Error(
        'Offer.id ' +
          req.params.id +
          ' does not exist or is not owned by: ' +
          res.locals.user.username
      )
    }
    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

module.exports = {
  all,
  findOne,
  addOne,
  updateOne,
  updateOwn,
  deleteOne,
  deleteOwn
}
