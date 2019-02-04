const Router = require('express').Router
const notifsController = require('../controllers/notifsController')

const router = Router()

router.get('/', notifsController.all)
router.post('/', notifsController.addOne)
router.get('/:id', notifsController.findOne)
router.put('/:id', notifsController.updateOne)
router.delete('/:id', notifsController.deleteOne)

module.exports = router
