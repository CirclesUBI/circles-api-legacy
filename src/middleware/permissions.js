const HttpStatus = require('http-status-codes')
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
    let r
    let permissionGranted = false
    let ac = await getPermissionDocuments().then(parsePermissions)
    user['cognito:groups'].forEach(role => {
      r = role
      permissionGranted = ac
        .can(role)
        .execute(action)
        .on(resource).granted
        ? true
        : false
    })
    if (!permissionGranted) console.log('not granted', r, action, resource)
    return permissionGranted
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const hasPermissionMiddlewareAsync = async (req, res, next) => {
  try {
    const granted = await hasPermission(
      res.locals.user,
      res.locals.resourceType,
      req.method
    )
    if (granted) next()
    else {
      res.status(HttpStatus.FORBIDDEN).send({
        error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
      })
    }
  } catch (error) {
    res.status(HttpStatus.FORBIDDEN).send({
      error: HttpStatus.getStatusText(HttpStatus.FORBIDDEN)
    })
  }
}

module.exports = hasPermissionMiddlewareAsync
