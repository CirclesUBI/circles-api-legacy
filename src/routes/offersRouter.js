const Router = require('express').Router
const offersController = require('../controllers/offersController')
const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get('/', hasPermissionMiddleware('allOffers'), offersController.all)
router.post('/', hasPermissionMiddleware('ownOffers'), offersController.addOwn)
router.get(
  '/:id',
  hasPermissionMiddleware('allOffers'),
  offersController.findOne
)
router.put(
  '/:id',
  hasPermissionMiddleware('ownOffers'),
  offersController.updateOwn
)
router.delete(
  '/:id',
  hasPermissionMiddleware('ownOffers'),
  offersController.deleteOwn
)

module.exports = router
