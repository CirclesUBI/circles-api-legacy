const Express = require('express');
const relayerController = require('../controllers/relayerController');

const router = Express.Router();

router.post('/signup', relayerController.signup);

module.exports = router;