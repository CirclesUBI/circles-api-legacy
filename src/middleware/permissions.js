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

const hasPermission = async (user, resource, action) => {
  try {
    let permissionGranted = false
    console.log(user.username, resource, action)
    let ac = await getPermissionDocuments().then(parsePermissions)
    for (let i = 0; i < user['cognito:groups'].length; i++) {
      const role = user['cognito:groups'][i]
      permissionGranted = ac
        .can(role)
        .execute(action)
        .on(resource).granted
        ? true
        : false
    }

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
  return (req, res, next) => {
    try {
      if (typeof res.locals.resource === 'undefined')
        res.locals.resource = resource
      return hasPermission(
        res.locals.user,
        res.locals.resource,
        req.method
      ).then(granted => {
        if (granted) {
          return next()
        } else {
          return res.status(HttpStatus.FORBIDDEN).send({
            error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
          })
        }
      })
    } catch (error) {
      logger.error(error.message)
      return res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
  }
}

const ownershipMiddleware = resource => {
  return (req, res, next) => {
    try {
      if (typeof resource === 'undefined') {
        return getUserOwnership(req, res).then(ownedResource => {
          res.locals.resource = ownedResource
          return next()
        })
      }
      res.locals.resource = resource
      return next()
    } catch (error) {
      logger.error(error.message)
      return res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
  }
}

const getUserOwnership = async (req, res) => {
  const result = await User.query().where({ id: res.locals.user.username })
  const user = result.length ? result[0] : null
  if (!user) {
    throw new Error('missing user ' + res.locals.user.username)
  }
  user.organizations = await user.$relatedQuery('organizations')
  user.offers = await user.$relatedQuery('offers')
  user.notifications = await user.$relatedQuery('notifications')
  return await whatOwnedResource(user, req.params.id)
}

// only works with unique offer and notif ids
const whatOwnedResource = async (user, paramId) =>
  user.id === paramId
    ? 'ownUser'
    : user.organizations.map(org => org.id).includes(paramId)
    ? 'ownOrgs'
    : user.notifications.map(notif => notif.id).includes(paramId)
    ? 'ownNotifs'
    : user.offers.map(offer => offer.id).includes(paramId)
    ? 'ownOffers'
    : undefined

module.exports = hasPermissionMiddleware
