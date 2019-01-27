const HttpStatus = require('http-status-codes');
const AccessControl = require('role-acl');
const Permission = require('../models/permissions');

const parsePermissions = perms => new AccessControl(perms);

const getPermissionDocuments = async () => {
  const perms = await Permission.query();
  // for now we aren't filtering by attributes
  return perms.map((p) => { p.attributes = ['*']; return p; })
};

const hasPermission = (user, resource, action) => {
  return getPermissionDocuments()
    .then(parsePermissions)
    .then((ac) => {
      let permissionGranted = false;
      user['cognito:groups'].forEach((role) => {
        if (ac.can(role).execute(action).on(resource).granted) { permissionGranted = true; }
      });
      return permissionGranted;
    });
};

const hasPermissionMiddleware = (resource, action) => {
  return (req, res, next) => {
    hasPermission(res.locals.user, resource, action).then((granted) => {
      if (granted) return next();
      res.status(HttpStatus.FORBIDDEN).send({ error: "Inadequate permissions" });
    });
  };
};

module.exports = hasPermissionMiddleware;