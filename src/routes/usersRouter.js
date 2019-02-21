const Router = require('express').Router
const usersController = require('../controllers/usersController')
const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get('/', hasPermissionMiddleware('allUsers'), usersController.all)
router.post('/', usersController.addOne) // question re hasPermissionMiddleware('ownUser')
router.get('/:id', hasPermissionMiddleware(), usersController.findOne)
router.put('/:id', hasPermissionMiddleware(), usersController.updateOne)
router.delete('/:id', hasPermissionMiddleware(), usersController.deleteOne)

module.exports = router
