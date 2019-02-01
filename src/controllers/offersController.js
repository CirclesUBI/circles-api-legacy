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
    if (offer instanceof Offer) {
      // if (offer.price.c.length === 1)
      //   console.log('we have a round num')
      // offer.owner = await offer.$relatedQuery('owner')
    }
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
    const offerExists = await Offer.query().where({ id: req.body.id })
    if (offerExists.length) {
      throw new Error('offer.id already exists: ' + req.body.id)
    } else {
      offer = await Offer.query().insert(req.body)
    }
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
      throw new Error('offer.id does not exist: ' + req.params.id)
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
      throw new Error('No offer.id: ' + req.params.id)
    }
    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

module.exports = { all, findOne, addOne, updateOne, deleteOne }
