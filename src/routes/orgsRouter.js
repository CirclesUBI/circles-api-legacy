const Router = require('express').Router;
const orgsController = require('../controllers/orgsController');

const router = Router()

router.get('/', orgsController.all);
router.get('/:id', orgsController.findOne);
router.post('/:id', orgsController.addOne);
router.delete('/:id', orgsController.deleteOne);

module.exports = router
