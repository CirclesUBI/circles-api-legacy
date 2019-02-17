const Router = require('express').Router
const orgsController = require('../controllers/orgsController')
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
        user.organizations = await user.$relatedQuery('organizations')
      }
      const orgIds = user.organizations.map(org => org.id)
      type = orgIds.includes(req.params.id) ? 'ownOrg' : 'allOrgs'
    } catch (error) {
      logger.error(error.message)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      })
    }
  } else {
    type = req.method === 'POST' ? 'ownOrg' : 'allOrgs'
  }
  res.locals.resourceType = type
  console.log('orgs', req.method, res.locals.resourceType)
  next()
}

router.get('/', determineResourceType, [
  hasPermissionMiddlewareAsync,
  orgsController.all
])
router.post('/', determineResourceType, [
  hasPermissionMiddlewareAsync,
  orgsController.addOne
])
router.get('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  orgsController.findOne
])
router.put('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  orgsController.updateOne
])
router.delete('/:id', determineResourceType, [
  hasPermissionMiddlewareAsync,
  orgsController.deleteOne
])

module.exports = router
