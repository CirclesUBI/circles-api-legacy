const Router = require('express').Router
const notifsController = require('../controllers/notifsController')
const User = require('../models/user')
const logger = require('../lib/logger')
const HttpStatus = require('http-status-codes')

const router = Router()

const hasPermissionMiddlewareAsync = require('../middleware/permissions')

const determineResourceType = async (req, res, next) => {
  let type
  if (req.params.id) {
    try {
      const result = await User.query().where({ id: res.locals.user.username })
      const user = result.length ? result[0] : null
      if (user instanceof User) {
        user.notifications = await user.$relatedQuery('notifications')
      }
      const notifIds = user.notifications.map(notifications => notifications.id)
      type = notifIds.includes(Number(req.params.id)) ? 'ownNotif' : 'allNotifs'
    } catch (error) {
      logger.error(error.message)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      })
    }
  } else {
    type = req.method === 'POST' ? 'ownNotif' : 'allNotifs'
  }
  res.locals.resourceType = type
  console.log('notifs', req.method, res.locals.resourceType)
  next()
}

router.get('/', determineResourceType, [
  hasPermissionMiddlewareAsync,
  notifsController.all
])
router.post('/', determineResourceType, [
  hasPermissionMiddlewareAsync,
  notifsController.addOne
])
router.get('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  notifsController.findOne
])
router.put('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  notifsController.updateOne
])
router.delete('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  notifsController.deleteOne
])

module.exports = router
