const Router = require('express').Router
const offersController = require('../controllers/offersController')
const router = Router()

const hasPermissionMiddleware = require('../middleware/permissions')

/**
 * @api {get} /offers/ Request all Offers
 * @apiName GetOffers
 * @apiGroup Offers
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiSuccess (Success 200) {Number} amount The amount of an item offered.
 * @apiSuccess (Success 200) {Boolean} category The category of item offered.
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} description Offer description.
 * @apiSuccess (Success 200) {Number} id Id of the Offer (ascending integer).
 * @apiSuccess (Success 200) {String} item_code Item code for linking with POS systems.
 * @apiSuccess (Success 200) {String} owner_id Url User Id of the Offer owner.
 * @apiSuccess (Success 200) {Number} percentage Percentage of Offer to be paid in Circles (multiple of 0.1).
 * @apiSuccess (Success 200) {Number} price Price of Offer in Circles (multiple of 0.1).
 * @apiSuccess (Success 200) {Boolean} public Is this Offer publicly viewable?
 * @apiSuccess (Success 200) {String} title The title of the Offer.
 * @apiSuccess (Success 200) {Enum} type The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 */
router.get('/', hasPermissionMiddleware('allOffers'), offersController.all)

/**
 * @api {post} /offers/ Create an Offer
 * @apiName PostOffer
 * @apiGroup Offers
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiSuccess (Success 201) {Number} amount The amount of an item offered.
 * @apiSuccess (Success 201) {Boolean} category The category of item offered.
 * @apiSuccess (Success 201) {Date} created_at Record creation date.
 * @apiSuccess (Success 201) {String} description Offer description.
 * @apiSuccess (Success 201) {Number} id Id of the Offer (ascending integer).
 * @apiSuccess (Success 201) {String} item_code Item code for linking with POS systems.
 * @apiSuccess (Success 201) {String} owner_id Url User Id of the Offer owner.
 * @apiSuccess (Success 201) {Number} percentage Percentage of Offer to be paid in Circles (multiple of 0.1).
 * @apiSuccess (Success 201) {Number} price Price of Offer in Circles (multiple of 0.1).
 * @apiSuccess (Success 201) {Boolean} public Is this Offer publicly viewable?
 * @apiSuccess (Success 201) {String} title The title of the Offer.
 * @apiSuccess (Success 200) {Enum} type The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.
 * @apiSuccess (Success 201) {Date} updated_at Record update date.
 */
router.get(
  '/:id',
  hasPermissionMiddleware('allOffers'),
  offersController.findOne
)

/**
 * @api {put} /offers/:offerId Update User's own Offer
 * @apiName UpdateOffer
 * @apiGroup Offers
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiParam {Number} Offer Id.
 *
 * @apiSuccess (Success 200) {Number} amount The amount of an item offered.
 * @apiSuccess (Success 200) {Boolean} category The category of item offered.
 * @apiSuccess (Success 200) {Date} created_at Record creation date.
 * @apiSuccess (Success 200) {String} description Offer description.
 * @apiSuccess (Success 200) {Number} id Id of the Offer (ascending integer).
 * @apiSuccess (Success 200) {String} item_code Item code for linking with POS systems.
 * @apiSuccess (Success 200) {String} owner_id Url User Id of the Offer owner.
 * @apiSuccess (Success 200) {Number} percentage Percentage of Offer to be paid in Circles (multiple of 0.1).
 * @apiSuccess (Success 200) {Number} price Price of Offer in Circles (multiple of 0.1).
 * @apiSuccess (Success 200) {Boolean} public Is this Offer publicly viewable?
 * @apiSuccess (Success 200) {String} title The title of the Offer.
 * @apiSuccess (Success 200) {Enum} type The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.
 * @apiSuccess (Success 200) {Date} updated_at Record update date.
 */
router.put(
  '/:id',
  hasPermissionMiddleware('ownOffers'),
  offersController.updateOwn
)

/**
 * @api {delete} /offers/:offerId Delete User's own Offer
 * @apiName DeleteOffer
 * @apiGroup Offers
 * @apiVersion 1.1.2
 * @apiPermission user, admin
 *
 * @apiParam {Number} Offer Id.
 *
 * @apiSuccess (Success 200) None Returns nothing on success.
 */
router.delete(
  '/:id',
  hasPermissionMiddleware('ownOffers'),
  offersController.deleteOwn
)

module.exports = router
