const Router = require('express').Router
const orgsController = require('../controllers/orgsController')

const router = Router()

const ownershipMiddleware = require('../middleware/permissions')
  .ownershipMiddleware
const hasPermissionMiddleware = require('../middleware/permissions')
  .hasPermissionMiddleware

router.get('/', ownershipMiddleware('allOrgs'), [
  hasPermissionMiddleware('allOrgs'),
  orgsController.all
])
router.post('/', ownershipMiddleware('ownOrg'), [
  hasPermissionMiddleware('allOrgs'),
  orgsController.addOne
])
router.get('/:id', ownershipMiddleware(), [
  hasPermissionMiddleware('allOrgs'),
  orgsController.findOne
])
router.put('/:id', ownershipMiddleware(), [
  hasPermissionMiddleware('allOrgs'),
  orgsController.updateOne
])
router.delete('/:id', ownershipMiddleware(), [
  hasPermissionMiddleware('allOrgs'),
  orgsController.deleteOne
])

module.exports = router
