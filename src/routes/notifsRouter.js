const Router = require('express').Router
const notifsController = require('../controllers/notifsController')

const router = Router()

const ownershipMiddleware = require('../middleware/permissions').ownershipMiddleware 
const hasPermissionMiddleware = require('../middleware/permissions').hasPermissionMiddleware 

router.get('/', ownershipMiddleware('allNotifs'), [hasPermissionMiddleware('allNotifs'), notifsController.all])
router.post('/', ownershipMiddleware('ownNotif'), [hasPermissionMiddleware('allNotifs'), notifsController.addOne])
router.get('/:id', ownershipMiddleware(), [hasPermissionMiddleware('allNotifs'), notifsController.findOne])
router.put('/:id', ownershipMiddleware(), [hasPermissionMiddleware('allNotifs'), notifsController.updateOne])
router.delete('/:id', ownershipMiddleware(), [hasPermissionMiddleware('allNotifs'), notifsController.deleteOne])

module.exports = router
