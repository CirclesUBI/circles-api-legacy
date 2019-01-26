const Router = require('express').Router;
const notifsController = require('../controllers/notifsController');

const router = Router()

router.get('/', notifsController.all)

module.exports = router
