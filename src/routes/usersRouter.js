const Router = require('express').Router
const usersController = require('../controllers/usersController')
const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get('/', 
  hasPermissionMiddleware('ownUser'),
  usersController.own
)
router.post('/', usersController.addOne)
router.put('/', 
  hasPermissionMiddleware('ownUser'),
  usersController.updateOwn
)
router.delete('/', 
  hasPermissionMiddleware('ownUser'),
  usersController.deleteOwn
)

module.exports = router
