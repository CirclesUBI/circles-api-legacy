const AccessControl = require('role-acl')
const Permission = require('../models/permissions')
const logger = require('../lib/logger')

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
    const ac = await getPermissionDocuments().then(parsePermissions)
    let index = 0
    while (user['cognito:groups'] && !permissionGranted && index < user['cognito:groups'].length) {
      const role = user['cognito:groups'][index]
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
          return res.sendStatus(403)
        }
      })
    } catch (error) {
      logger.error(error.message)
      return res.sendStatus(403)
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
      return res.sendStatus(403)
    }
  }
}

module.exports = hasPermissionMiddleware
