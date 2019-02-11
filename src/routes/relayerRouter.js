const Express = require('express');
const relayerController = require('../controllers/relayerController');

const router = Express.Router();

router.post('/:contractName', relayerController.callContract);

module.exports = router;
