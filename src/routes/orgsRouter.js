const Router = require('express').Router
const orgsController = require('../controllers/orgsController')

const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get('/', hasPermissionMiddleware('ownOrgs'), orgsController.own)
router.post('/', hasPermissionMiddleware('ownOrgs'), orgsController.addOwn)
router.get('/:id', hasPermissionMiddleware('ownOrgs'), orgsController.findOwn)
router.put('/:id', hasPermissionMiddleware('ownOrgs'), orgsController.updateOwn)
router.delete(
  '/:id',
  hasPermissionMiddleware('ownOrgs'),
  orgsController.deleteOwn
)

module.exports = router
