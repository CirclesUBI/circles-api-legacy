const Express = require('express')
const relayerController = require('../controllers/relayerController')

const router = Express.Router()

router.post('/relay', relayerController.relay)

module.exports = router
