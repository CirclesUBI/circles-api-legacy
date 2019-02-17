const Router = require('express').Router
const usersController = require('../controllers/usersController')
const router = Router()

const hasPermissionMiddlewareAsync = require('../middleware/permissions')

const determineResourceType = (req, res, next) => {
  res.locals.resourceType =
    req.params.id === res.locals.user.username || req.method === 'POST'
      ? 'ownUser'
      : 'allUsers'
  console.log('users', req.method, res.locals.resourceType)
  next()
}

router.get('/', determineResourceType, [
  hasPermissionMiddlewareAsync,
  usersController.all
])
router.post('/', determineResourceType, usersController.addOne) // todo: 1. is this correct?
router.get('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  usersController.findOne
])
router.put('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  usersController.updateOne
])
router.delete('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  usersController.deleteOne
])

module.exports = router
