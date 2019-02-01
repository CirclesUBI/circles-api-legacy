const Router = require('express').Router
const usersController = require('../controllers/usersController')

const router = Router()

router.get('/', usersController.all)
router.post('/', usersController.addOne)
router.get('/:id', usersController.findOne)
router.put('/:id', usersController.updateOne)
router.delete('/:id', usersController.deleteOne)

module.exports = router
