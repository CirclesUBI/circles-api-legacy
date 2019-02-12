const Express = require('express')
const relayerController = require('../controllers/relayerController')

const router = Express.Router()

//router.post('/:contractName/', relayerController.callContract)

//to-do put auth middleware here
router.post('/relay/', relayerController.callContract)

module.exports = router
