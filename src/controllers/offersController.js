const HttpStatus = require('http-status-codes')
const PostgresDB = require('../database').postgresDB
const Offer = require('../models/offer')
const logger = require('../lib/logger')

// we don't have allOwn in offers since clients can view all offers
// but perhaps we should order own offers first in the return or something
// if we don't create another route
async function all (req, res) {
  try {
    const offers = await Offer.query()
    if (!offers.length) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
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
    const offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (!offer) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
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
    offer = await Offer.query().insert(req.body)
    res.status(HttpStatus.CREATED).send(offer)
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
  try {
    const offer = await Offer.query().insert(req.body)
    res.status(HttpStatus.CREATED).send(offer)
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
    offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (!offer) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    offer = await Offer.query().patchAndFetchById(req.params.id, req.body)
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
    offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (!offer) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    } else if (offer.owner_id !== res.locals.user.username) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
    offer = await Offer.query().patchAndFetchById(req.params.id, req.body)
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
    if (!offer) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    }
    await Offer.query()
      .delete()
      .where({ id: req.params.id })
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
      .where({ id: req.params.id })
      .first()
    if (!offer) {
      res.status(HttpStatus.NOT_FOUND).send({
        error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      })
    } else if (offer.owner_id !== res.locals.user.username) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
    await Offer.query()
      .delete()
      .where({ id: req.params.id })
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
  addOwn,
  updateOne,
  updateOwn,
  deleteOne,
  deleteOwn
}
