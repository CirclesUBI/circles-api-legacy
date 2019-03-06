const Router = require('express').Router
const usersController = require('../controllers/usersController')
const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

/**
 * @api {get} /users/ Request User's own record
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiSuccess (Success 200) {Boolean} agreed_to_disclaimer Legal requirement.
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} device_endpoint Notification endpoint.
 * @apiSuccess (Success 200) {String} device_id Device Id of phone.
 * @apiSuccess (Success 200) {String} display_name Full name of the User.
 * @apiSuccess (Success 200) {String} email Email of the User.
 * @apiSuccess (Success 200) {String} id UUID of the User.
 * @apiSuccess (Success 200) {String} phone_number Phone number of the User.
 * @apiSuccess (Success 200) {String} profile_pic_url Url of profile pic (stored on S3).
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 * @apiSuccess (Success 200) {String} username Username of the User.
 */
router.get('/', hasPermissionMiddleware('ownUser'), usersController.own)

/**
 * @api {post} /users/ Create User's own record
 * @apiName PostUser
 * @apiGroup Users
 * @apiVersion 1.1.2
 * @apiPermission none
 *
 * @apiDescription Create User record (201) or return if exists (200)
 *
 * @apiSuccess (Success 200/201) {Boolean} agreed_to_disclaimer Legal requirement.
 * @apiSuccess (Success 200/201) {Date} created_at Record creation date.
 * @apiSuccess (Success 200/201) {String} device_endpoint Notification endpoint.
 * @apiSuccess (Success 200/201) {String} device_id Device Id of phone.
 * @apiSuccess (Success 200/201) {String} display_name Full name of the User.
 * @apiSuccess (Success 200/201) {String} email Email of the User.
 * @apiSuccess (Success 200/201) {String} id UUID of the User.
 * @apiSuccess (Success 200/201) {String} phone_number Phone number of the User.
 * @apiSuccess (Success 200/201) {String} profile_pic_url Url of profile pic (stored on S3).
 * @apiSuccess (Success 200/201) {Date} updated_at Record update date.
 * @apiSuccess (Success 200/201) {String} username Username of the User.
 */
router.post('/', usersController.addOwn)

/**
 * @api {put} /users/ Update User's own record
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiSuccess (Success 200) {Boolean} agreed_to_disclaimer Legal requirement.
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} device_endpoint Notification endpoint.
 * @apiSuccess (Success 200) {String} device_id Device Id of phone.
 * @apiSuccess (Success 200) {String} display_name Full name of the User.
 * @apiSuccess (Success 200) {String} email Email of the User.
 * @apiSuccess (Success 200) {String} id UUID of the User.
 * @apiSuccess (Success 200) {String} phone_number Phone number of the User.
 * @apiSuccess (Success 200) {String} profile_pic_url Url of profile pic (stored on S3).
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 * @apiSuccess (Success 200) {String} username Username of the User.
 */
router.put('/', hasPermissionMiddleware('ownUser'), usersController.updateOwn)

/**
 * @api {delete} /users/ Delete User's own record
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiSuccess (Success 200) None Returns nothing on success.
 */
router.delete(
  '/',
  hasPermissionMiddleware('ownUser'),
  usersController.deleteOwn
)

module.exports = router
