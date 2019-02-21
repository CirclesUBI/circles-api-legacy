const Router = require('express').Router
const usersController = require('../controllers/usersController')
const router = Router()

const ownershipMiddleware = require('../middleware/permissions').ownershipMiddleware 
const hasPermissionMiddleware = require('../middleware/permissions').hasPermissionMiddleware 

router.get('/', ownershipMiddleware('allUsers'), [hasPermissionMiddleware('allUsers'), usersController.all])
router.post('/', usersController.addOne)
router.get('/:id', ownershipMiddleware(), [hasPermissionMiddleware('allUsers'), usersController.findOne])
router.put('/:id', ownershipMiddleware(), [hasPermissionMiddleware('allUsers'), usersController.updateOne])
router.delete('/:id', ownershipMiddleware(), [hasPermissionMiddleware('allUsers'), usersController.deleteOne])

module.exports = router
