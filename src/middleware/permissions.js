import AccessControl from 'role-acl';
import Permissions from '../models/permissions';

const parsePermissions = perms => new AccessControl(perms);

const getPermissionDocuments = async () => {
  const perms = await Permissions.query().select('role resource action')
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
      res.status(403).send("Inadequate permissions");
    });
  };
};

export default hasPermissionMiddleware;