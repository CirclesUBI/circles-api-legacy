const Router = require('express').Router
const offersController = require('../controllers/offersController')
const User = require('../models/user')
const Organization = require('../models/organization')
const Offer = require('../models/offer')
const logger = require('../lib/logger')
const HttpStatus = require('http-status-codes')

const router = Router()

const hasPermissionMiddlewareAsync = require('../middleware/permissions')

const determineResourceType = async (req, res, next) => {
  let type
  let offerOwnerId
  if (req.method === 'GET') {
    type = 'allOffers'
  }
  else if (req.method === 'POST' && req.body.owner_id === res.locals.user.username) {
    type = 'ownOffer'
  }
  else {
    try {
      offerOwner = (req.params.id)
        ? await Offer.query().where({ id: req.params.id }).first()
        : await Organization.query().where({ owner_id: req.body.owner_id }).first()
      console.log('offerOwner', offerOwner)
      console.log('res.locals.user.username', res.locals.user.username)
      type = offerOwner && offerOwner.owner_id === res.locals.user.username ? 'ownOffer' : 'allOffers'
    } catch (error) {
      logger.error(error.message)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      })
    }
  }
  res.locals.resourceType = type
  console.log('offers', req.method, res.locals.resourceType)
  next()
}

router.get('/', determineResourceType, [
  hasPermissionMiddlewareAsync,
  offersController.all
])
router.post('/', determineResourceType, [
  hasPermissionMiddlewareAsync,
  offersController.addOne
])
router.get('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  offersController.findOne
])
router.put('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  offersController.updateOne
])
router.delete('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  offersController.deleteOne
])

module.exports = router
