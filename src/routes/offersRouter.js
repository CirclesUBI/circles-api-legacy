const Router = require('express').Router
const offersController = require('../controllers/offersController')
const router = Router()

const ownershipMiddleware = require('../middleware/permissions')
  .ownershipMiddleware
const hasPermissionMiddleware = require('../middleware/permissions')
  .hasPermissionMiddleware

router.get('/', ownershipMiddleware('allOffers'), [
  hasPermissionMiddleware('allOffers'),
  offersController.all
])
router.post('/', ownershipMiddleware('ownOffer'), [
  hasPermissionMiddleware('allOffers'),
  offersController.addOne
])
router.get('/:id', ownershipMiddleware(), [
  hasPermissionMiddleware('allOffers'),
  offersController.findOne
])
router.put('/:id', ownershipMiddleware(), [
  hasPermissionMiddleware('allOffers'),
  offersController.updateOne
])
router.delete('/:id', ownershipMiddleware(), [
  hasPermissionMiddleware('allOffers'),
  offersController.deleteOne
])

module.exports = router
