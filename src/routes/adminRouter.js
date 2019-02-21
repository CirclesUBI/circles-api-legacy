const Router = require('express').Router
const offersController = require('../controllers/offersController')
const usersController = require('../controllers/usersController')
const orgsController = require('../controllers/orgsController')
const notifController = require('../controllers/notifsController')
const relayerController = require('../controllers/relayerController')

const ownershipMiddleware = require('../middleware/permissions')
  .ownershipMiddleware
const hasPermissionMiddleware = require('../middleware/permissions')
  .hasPermissionMiddleware

const router = Router()

// Users
router.get('/users/', ownershipMiddleware('allUsers'), [
  hasPermissionMiddleware(),
  usersController.all
])
router.post('/users/', ownershipMiddleware('allUsers'), [
  hasPermissionMiddleware(),
  usersController.addOne
])
router.get('/users/:id', ownershipMiddleware('allUsers'), [
  hasPermissionMiddleware(),
  usersController.findOne
])
router.put('/users/:id', ownershipMiddleware('allUsers'), [
  hasPermissionMiddleware(),
  usersController.updateOne
])
router.delete('/users/:id', ownershipMiddleware('allUsers'), [
  hasPermissionMiddleware(),
  usersController.deleteOne
])

// Orgs
router.get('/orgs/', ownershipMiddleware('allUsers'), [
  hasPermissionMiddleware(),
  orgsController.all
])
router.post('/orgs/', ownershipMiddleware('allOrgs'), [
  hasPermissionMiddleware(),
  orgsController.addOne
])
router.get('/orgs/:id', ownershipMiddleware('allOrgs'), [
  hasPermissionMiddleware(),
  orgsController.findOne
])
router.put('/orgs/:id', ownershipMiddleware('allOrgs'), [
  hasPermissionMiddleware(),
  orgsController.updateOne
])
router.delete('/orgs/:id', ownershipMiddleware('allOrgs'), [
  hasPermissionMiddleware(),
  orgsController.deleteOne
])

// Offers
router.get('/offers/', ownershipMiddleware('allOffers'), [
  hasPermissionMiddleware(),
  offersController.all
])
router.post('/offers/', ownershipMiddleware('allOffers'), [
  hasPermissionMiddleware(),
  offersController.addOne
])
router.get('/offers/:id', ownershipMiddleware('allOffers'), [
  hasPermissionMiddleware(),
  offersController.findOne
])
router.put('/offers/:id', ownershipMiddleware('allOffers'), [
  hasPermissionMiddleware(),
  offersController.updateOne
])
router.delete('/offers/:id', ownershipMiddleware('allOffers'), [
  hasPermissionMiddleware(),
  offersController.deleteOne
])

// Notifs
router.get('/notifs/', ownershipMiddleware('allNotifs'), [
  hasPermissionMiddleware(),
  notifController.all
])
router.post('/notifs/', ownershipMiddleware('allNotifs'), [
  hasPermissionMiddleware(),
  notifController.addOne
])
router.get('/notifs/:id', ownershipMiddleware('allNotifs'), [
  hasPermissionMiddleware(),
  notifController.findOne
])
router.put('/notifs/:id', ownershipMiddleware('allNotifs'), [
  hasPermissionMiddleware(),
  notifController.updateOne
])
router.delete('/notifs/:id', ownershipMiddleware('allNotifs'), [
  hasPermissionMiddleware(),
  notifController.deleteOne
])

// Relayer
router.post('/relayer/:contractName', relayerController.callContract)

module.exports = router
