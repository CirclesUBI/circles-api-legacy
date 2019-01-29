const Router = require('express').Router;
const offersController = require('../controllers/offersController');

const router = Router()

router.get('/', offersController.all);
router.post('/', offersController.addOne);
router.get('/:id', offersController.findOne);
router.put('/:id', offersController.updateOne);
router.delete('/:id', offersController.deleteOne);

module.exports = router
