const Router = require('express').Router
const offersController = require('../controllers/offersController')
const User = require('../models/user')
const Organization = require('../models/organization')
const Offer = require('../models/offer')
const logger = require('../lib/logger')
const HttpStatus = require('http-status-codes')

const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get('/', hasPermissionMiddleware('allOffers'), offersController.all)
router.post('/', hasPermissionMiddleware('ownOffer'), offersController.addOne)
router.get('/:id', hasPermissionMiddleware(), offersController.findOne)
router.put('/:id', hasPermissionMiddleware(), offersController.updateOne)
router.delete('/:id', hasPermissionMiddleware(), offersController.deleteOne)

module.exports = router
