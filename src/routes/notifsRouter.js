const Router = require('express').Router
const notifsController = require('../controllers/notifsController')
const User = require('../models/user')
const logger = require('../lib/logger')
const HttpStatus = require('http-status-codes')

const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get('/', hasPermissionMiddleware('allNotifs'), notifsController.all)
router.post('/', hasPermissionMiddleware('ownNotif'), notifsController.addOne)
router.get('/:id', hasPermissionMiddleware(), notifsController.findOne)
router.put('/:id', hasPermissionMiddleware(), notifsController.updateOne)
router.delete('/:id', hasPermissionMiddleware(), notifsController.deleteOne)

module.exports = router
