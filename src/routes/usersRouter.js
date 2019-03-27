const Router = require('express').Router
const usersController = require('../controllers/usersController')
const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get('/', hasPermissionMiddleware('ownUser'), usersController.own)
router.post('/', usersController.addOwn)
router.put('/', hasPermissionMiddleware('ownUser'), usersController.updateOwn)
router.delete(
  '/',
  hasPermissionMiddleware('ownUser'),
  usersController.deleteOwn
)

router.post('/recover/:wallet_address', usersController.recoverAccount)

module.exports = router
