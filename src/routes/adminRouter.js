const Router = require('express').Router
const offersController = require('../controllers/offersController')
const usersController = require('../controllers/usersController')
const orgsController = require('../controllers/orgsController')
const notifController = require('../controllers/notifsController')

const hasPermissionMiddleware = require('../middleware/permissions')

const router = Router()

// Users
router.get('/users/', hasPermissionMiddleware('allUsers'), usersController.all)
router.post(
  '/users/',
  hasPermissionMiddleware('allUsers'),
  usersController.addOne
)
router.get(
  '/users/:id',
  hasPermissionMiddleware('allUsers'),
  usersController.findOne
)
router.put(
  '/users/:id',
  hasPermissionMiddleware('allUsers'),
  usersController.updateOne
)
router.delete(
  '/users/:id',
  hasPermissionMiddleware('allUsers'),
  usersController.deleteOne
)

// Orgs
router.get('/orgs/', hasPermissionMiddleware('allOrgs'), orgsController.all)
router.post('/orgs/', hasPermissionMiddleware('allOrgs'), orgsController.addOne)
router.get(
  '/orgs/:id',
  hasPermissionMiddleware('allOrgs'),
  orgsController.findOne
)
router.put(
  '/orgs/:id',
  hasPermissionMiddleware('allOrgs'),
  orgsController.updateOne
)
router.delete(
  '/orgs/:id',
  hasPermissionMiddleware('allOrgs'),
  orgsController.deleteOne
)

// Offers
router.get(
  '/offers/',
  hasPermissionMiddleware('allOffers'),
  offersController.all
)
router.post(
  '/offers/',
  hasPermissionMiddleware('allOffers'),
  offersController.addOne
)
router.get(
  '/offers/:id',
  hasPermissionMiddleware('allOffers'),
  offersController.findOne
)
router.put(
  '/offers/:id',
  hasPermissionMiddleware('allOffers'),
  offersController.updateOne
)
router.delete(
  '/offers/:id',
  hasPermissionMiddleware('allOffers'),
  offersController.deleteOne
)

// Notifs
router.get(
  '/notifs/',
  hasPermissionMiddleware('allNotifs'),
  notifController.all
)
router.post(
  '/notifs/',
  hasPermissionMiddleware('allNotifs'),
  notifController.addOne
)
router.get(
  '/notifs/:id',
  hasPermissionMiddleware('allNotifs'),
  notifController.findOne
)
router.put(
  '/notifs/:id',
  hasPermissionMiddleware('allNotifs'),
  notifController.updateOne
)
router.delete(
  '/notifs/:id',
  hasPermissionMiddleware('allNotifs'),
  notifController.deleteOne
)

module.exports = router
