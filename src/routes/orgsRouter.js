const Router = require('express').Router
const orgsController = require('../controllers/orgsController')

const router = Router()

router.get('/', orgsController.all)
router.post('/', orgsController.addOne)
router.get('/:id', orgsController.findOne)
router.put('/:id', orgsController.updateOne)
router.delete('/:id', orgsController.deleteOne)

module.exports = router
