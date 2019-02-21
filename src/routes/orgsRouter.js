const Router = require('express').Router
const orgsController = require('../controllers/orgsController')
const User = require('../models/user')
const logger = require('../lib/logger')
const HttpStatus = require('http-status-codes')

const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

router.get('/', hasPermissionMiddleware('allOrgs'), orgsController.all)
router.post('/', hasPermissionMiddleware('ownOrg'), orgsController.addOne)
router.get('/:id', hasPermissionMiddleware(), orgsController.findOne)
router.put('/:id', hasPermissionMiddleware(), orgsController.updateOne)
router.delete('/:id', hasPermissionMiddleware(), orgsController.deleteOne)

module.exports = router
