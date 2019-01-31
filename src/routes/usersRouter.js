const Router = require('express').Router;
const usersController = require('../controllers/usersController');

const router = Router();

router.get('/', usersController.all);
router.get('/:id', usersController.findOne);
router.post('/:id', usersController.addOne);
router.delete('/:id', usersController.deleteOne);
router.post('/createToken', usersController.createToken);

module.exports = router;
