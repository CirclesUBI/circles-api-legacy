const Router = require('express').Router;
const offersController = require('../controllers/offersController');

const router = Router()

router.get('/', offersController.all);
router.get('/:id', offersController.findOne);
router.post('/:id', offersController.addOne);
router.delete('/:id', offersController.deleteOne);

module.exports = router
