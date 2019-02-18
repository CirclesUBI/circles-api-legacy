const Router = require('express').Router
const usersController = require('../controllers/usersController')
const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

const determineResourceType = (req, res, next) => {
  res.locals.resourceType =
    req.params.id === res.locals.user.username || req.method === 'POST'
      ? 'ownUser'
      : 'allUsers'
  next()
}

router.get('/', determineResourceType, [
  hasPermissionMiddleware,
  usersController.all
])
router.post('/', determineResourceType, usersController.addOne) // todo: 1. is this correct?
router.get('/:id', determineResourceType, [
  hasPermissionMiddleware,
  usersController.findOne
])
router.put('/:id', determineResourceType, [
  hasPermissionMiddleware,
  usersController.updateOne
])
router.delete('/:id', determineResourceType, [
  hasPermissionMiddleware,
  usersController.deleteOne
])

module.exports = router
