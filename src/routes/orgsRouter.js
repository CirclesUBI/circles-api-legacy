const Router = require('express').Router
const orgsController = require('../controllers/orgsController')

const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

/**
 * @api {get} /orgs/ Request all User's own Organizations
 * @apiName GetOrgs
 * @apiGroup Orgs
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiSuccess (Success 200) {String} address Organisation address.
 * @apiSuccess (Success 200) {Boolean} agreed_to_disclaimer Legal requirement.
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} description Organization tagline.
 * @apiSuccess (Success 200) {String} email Email of the Organization.
 * @apiSuccess (Success 200) {String} id UUID of the Organization.
 * @apiSuccess (Success 200) {Date} last_active Last date Organization was active.
 * @apiSuccess (Success 200) {Float} latitude Latitude of Organization
 * @apiSuccess (Success 200) {Float} longitude longitude of Organization
 * @apiSuccess (Success 200) {String} organization_name Display name of Organization.
 * @apiSuccess (Success 200) {String} owner_id User Id of the Organization owner.
 * @apiSuccess (Success 200) {String} profile_pic_url Url of profile pic (stored on S3).
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 */
router.get('/', hasPermissionMiddleware('ownOrgs'), orgsController.allOwn)

/**
 * @api {post} /orgs/ Create User's own Organization
 * @apiName PostOrg
 * @apiGroup Orgs
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiDescription Create Organization record (201) or return if exists (200)
 *
 * @apiSuccess (Success 200/201) {String} address Organisation address.
 * @apiSuccess (Success 200/201) {Boolean} agreed_to_disclaimer Legal requirement.
 * @apiSuccess (Success 200/201) {Date} created_at Record creation date.
 * @apiSuccess (Success 200/201) {String} description Organization tagline.
 * @apiSuccess (Success 200/201) {String} email Email of the Organization.
 * @apiSuccess (Success 200/201) {String} id UUID of the Organization.
 * @apiSuccess (Success 200/201) {Date} last_active Last date Organization was active.
 * @apiSuccess (Success 200/201) {Float} latitude Latitude of Organization
 * @apiSuccess (Success 200/201) {Float} longitude longitude of Organization
 * @apiSuccess (Success 200/201) {String} organization_name Display name of Organization.
 * @apiSuccess (Success 200/201) {String} owner_id User Id of the Organization owner.
 * @apiSuccess (Success 200/201) {String} profile_pic_url Url of profile pic (stored on S3).
 * @apiSuccess (Success 200/201) {Date} updated_at Record update date.
 */
router.post('/', hasPermissionMiddleware('ownOrgs'), orgsController.addOwn)

/**
 * @api {get} /orgs/:orgId Request User's own Organization
 * @apiName GetOrg
 * @apiGroup Orgs
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiParam {String} orgId Organization UUID.
 *
 * @apiSuccess (Success 200) {String} address Organisation address.
 * @apiSuccess (Success 200) {Boolean} agreed_to_disclaimer Legal requirement.
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} description Organization tagline.
 * @apiSuccess (Success 200) {String} email Email of the Organization.
 * @apiSuccess (Success 200) {String} id UUID of the Organization.
 * @apiSuccess (Success 200) {Date} last_active Last date Organization was active.
 * @apiSuccess (Success 200) {Float} latitude Latitude of Organization
 * @apiSuccess (Success 200) {Float} longitude longitude of Organization
 * @apiSuccess (Success 200) {String} organization_name Display name of Organization.
 * @apiSuccess (Success 200) {String} owner_id User Id of the Organization owner.
 * @apiSuccess (Success 200) {String} profile_pic_url Url of profile pic (stored on S3).
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 */
router.get('/:id', hasPermissionMiddleware('ownOrgs'), orgsController.findOwn)

/**
 * @api {put} /orgs/:orgId Update User's own Organization
 * @apiName UpdateOrg
 * @apiGroup Orgs
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiParam {String} orgId Organization UUID.
 *
 * @apiSuccess (Success 200) {String} address Organisation address.
 * @apiSuccess (Success 200) {Boolean} agreed_to_disclaimer Legal requirement.
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} description Organization tagline.
 * @apiSuccess (Success 200) {String} email Email of the Organization.
 * @apiSuccess (Success 200) {String} id UUID of the Organization.
 * @apiSuccess (Success 200) {Date} last_active Last date Organization was active.
 * @apiSuccess (Success 200) {Float} latitude Latitude of Organization
 * @apiSuccess (Success 200) {Float} longitude longitude of Organization
 * @apiSuccess (Success 200) {String} organization_name Display name of Organization.
 * @apiSuccess (Success 200) {String} owner_id User Id of the Organization owner.
 * @apiSuccess (Success 200) {String} profile_pic_url Url of profile pic (stored on S3).
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 */
router.put('/:id', hasPermissionMiddleware('ownOrgs'), orgsController.updateOwn)

/**
 * @api {delete} /orgs/:orgId Update User's own Organization
 * @apiName DeleteOrg
 * @apiGroup Orgs
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiParam {String} orgId Organization UUID.
 *
 * @apiSuccess (Success 200) None Returns nothing on success.
 */
router.delete(
  '/:id',
  hasPermissionMiddleware('ownOrgs'),
  orgsController.deleteOwn
)

module.exports = router
