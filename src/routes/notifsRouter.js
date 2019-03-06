const Router = require('express').Router
const notifsController = require('../controllers/notifsController')

const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

/**
 * @api {get} /notifs/ Request all User's own Notifications
 * @apiName GetNotifs
 * @apiGroup Notifs
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} description Notification text. 
 * @apiSuccess (Success 200) {String} dismissed Has this Notification been dismissed?
 * @apiSuccess (Success 200) {Number} id Id of the Notification (ascending integer).
 * @apiSuccess (Success 200) {String} owner_id Url User Id of the Notification owner.
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 */
router.get('/', hasPermissionMiddleware('ownNotifs'), notifsController.allOwn)

/**
 * @api {put} /notifs/:notifId Update User's own Notification
 * @apiName UpdateNotif
 * @apiGroup Notifs
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 * 
 * @apiParam {Number} Notification Id.
 *
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} description Notification text. 
 * @apiSuccess (Success 200) {String} dismissed Has this Notification been dismissed?
 * @apiSuccess (Success 200) {Number} id Id of the Notification (ascending integer).
 * @apiSuccess (Success 200) {String} owner_id Url User Id of the Notification owner.
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 */
router.put(
  '/:id',
  hasPermissionMiddleware('ownNotifs'),
  notifsController.updateOwn
)

/**
 * @api {delete} /notifs/:notifId Delete User's own Notification
 * @apiName DeleteNotif
 * @apiGroup Notifs
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 * 
 * @apiParam {Number} Notification Id.
 *
 * @apiSuccess (Success 200) None Returns nothing on success.
 */
router.delete(
  '/:id',
  hasPermissionMiddleware('ownNotifs'),
  notifsController.deleteOwn
)

module.exports = router
