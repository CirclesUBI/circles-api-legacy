const HttpStatus = require('http-status-codes')
const AccessControl = require('role-acl')
const Permission = require('../models/permissions')
const logger = require('../lib/logger')
const User = require('../models/user')

const parsePermissions = perms => new AccessControl(perms)

const getPermissionDocuments = async () => {
  const perms = await Permission.query()
  // for now we aren't filtering by attributes
  return perms.map(p => {
    p.attributes = ['*']
    return p
  })
}

const getUserOwnership = async (req, res) => {
  console.log('getUserOwnership')
  const result = await User.query().where({ id: res.locals.user.username })
  const user = result.length ? result[0] : null
  if (!user) throw new Error('missing user ' + res.locals.user.username)
  user.organizations = await user.$relatedQuery('organizations')
  user.offers = await user.$relatedQuery('offers')
  user.notifications = await user.$relatedQuery('notifications')
  console.log('user.id', user.id)
  console.log('req.params.id', req.params.id)
  return await whatOwnedResource(user, req.params.id)
}

// only works with unique offer and notif ids
const whatOwnedResource = async (user, paramId) =>
  user.id === paramId
    ? 'ownUser'
    : user.organizations.map(org => org.id).includes(paramId)
    ? 'ownOrg'
    : user.notifications.map(notif => notif.id).includes(paramId)
    ? 'ownNotif'
    : user.offers.map(offer => offer.id).includes(paramId)
    ? 'ownOffer'
    : 'all'

const hasPermission = async (user, resource, action) => {
  try {
    let permissionGranted = false
    let ac = await getPermissionDocuments().then(parsePermissions)
    user['cognito:groups'].forEach(role => {
      console.log(role, action, resource)
      permissionGranted = ac
        .can(role)
        .execute(action)
        .on(resource).granted
        ? true
        : false
    })
    logger.info(
      `Permissions: ${user['cognito:groups'].join(
        ','
      )} ${action} on ${resource} : ${
        permissionGranted ? '[GRANTED]' : '[FORBIDDEN]'
      }`
    )
    return permissionGranted
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const hasPermissionMiddleware = resource => {
  return async (req, res, next) => {
    try {
      console.log('resouce bfore', resource)
      if (req.params.id && typeof resource === 'undefined')
        resource = await getUserOwnership(req, res)
      console.log('resouce aftr', resource)
      return hasPermission(res.locals.user, resource, req.method).then(
        granted => {
          if (granted) {
            return next()
          } else {
            return res.status(HttpStatus.FORBIDDEN).send({
              error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
            })
          }
        }
      )
    } catch (error) {
      logger.error(error.message)
      return res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
  }
}

module.exports = hasPermissionMiddleware
