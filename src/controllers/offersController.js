const Offer = require('../models/offer')
const logger = require('../lib/logger')

// we don't have allOwn in offers since clients can view all offers
// but perhaps we should order own offers first in the return or something
// if we don't create another route
async function all (req, res) {
  try {
    const offers = await Offer.query()
    if (!offers.length) return res.sendStatus(404)
    res.status(200).send(offers)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function findOne (req, res) {
  try {
    const offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (!offer) res.sendStatus(404)
    res.status(200).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function addOne (req, res) {
  let offer
  try {
    offer = await Offer.query().insert(req.body)
    res.status(201).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function addOwn (req, res) {
  if (req.body.owner_id !== res.locals.user.sub) return res.sendStatus(403)

  try {
    const offer = await Offer.query().insert(req.body)
    res.status(201).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function updateOne (req, res) {
  let offer
  try {
    offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (!offer) res.sendStatus(404)

    offer = await Offer.query().patchAndFetchById(req.params.id, req.body)
    res.status(200).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function updateOwn (req, res) {
  let offer
  try {
    offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (!offer) return res.sendStatus(404)
    else if (offer.owner_id !== res.locals.user.sub)
      return res.sendStatus(403)

    offer = await Offer.query().patchAndFetchById(req.params.id, req.body)
    res.status(200).send(offer)
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function deleteOne (req, res) {
  try {
    const offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (!offer) return res.sendStatus(404)

    await Offer.query()
      .delete()
      .where({ id: req.params.id })
    res.status(200).send()
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

async function deleteOwn (req, res) {
  try {
    const offer = await Offer.query()
      .where({ id: req.params.id })
      .first()
    if (!offer) res.sendStatus(404)
    else if (offer.owner_id !== res.locals.user.sub) res.sendStatus(403)

    await Offer.query()
      .delete()
      .where({ id: req.params.id })
    res.status(200).send()
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
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
