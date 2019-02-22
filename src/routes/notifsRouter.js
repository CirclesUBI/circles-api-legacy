const Router = require('express').Router
const notifsController = require('../controllers/notifsController')

const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get(
  '/',
  hasPermissionMiddleware('ownNotifs'),
  notifsController.own
)

router.put(
  '/:id',
  hasPermissionMiddleware('ownNotifs'),
  notifsController.updateOwn
)

router.delete(
  '/:id',
  hasPermissionMiddleware('ownNotifs'),
  notifsController.deleteOwn
)

module.exports = router
