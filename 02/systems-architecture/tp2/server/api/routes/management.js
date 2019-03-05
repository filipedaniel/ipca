const express = require('express');
const router = express.Router();

const ManagementController = require('../controllers/management');

const CheckAuth = require('../middleware/check-auth');


/**
 * @api {get} /management List all Managements
 * @apiGroup Management
 * @apiPermission Admin
 * @apiDescription List all managements
 * 
 * @apiSuccess {Number} total Total managements records
 * @apiSuccess {Number} skip Skip managements pagination
 * @apiSuccess {Number} page Page current managements pagination
 * @apiSuccess {Number} pages Total pages
 * 
 * @apiSuccess {Object[]} data Managements list
 * @apiSuccess {String} data._id Management id
 * 
 * @apiSuccess {Object} data.car Management car information
 * @apiSuccess {String} data.car._id Car id
 * @apiSuccess {String} data.car.type Car type
 * @apiSuccess {String} data.car.registration Car registration
 * 
 * @apiSuccess {Object} data.user Management User information
 * @apiSuccess {String} data.user._id User id
 * @apiSuccess {String} data.user.name User name
 * @apiSuccess {String} data.user.email User email
 * 
 * @apiSuccess {Object} data.parking Management Parking information
 * @apiSuccess {String} data.parking._id Parking id
 * @apiSuccess {String} data.parking.city Parking city id
 * @apiSuccess {Object} data.parking.location Parking location information
 * @apiSuccess {String} data.parking.location.street Parking location street
 * @apiSuccess {Number[]} data.parking.location.coordinates Parking location coordinates
 * @apiSuccess {String} data.parking.type Parking type
 * 
 * @apiSuccess {Date} data.entryTime Parking location street
 * @apiSuccess {Number} data.timeExpected Parking location street
 * @apiSuccess {Number} data.valueExpected Parking location street
 * @apiSuccess {Date} data.exitTimeExpected Parking location street
 * @apiSuccess {Date} data.exitTime Parking location street
 * @apiSuccess {Number} data.fee Parking location street
 * @apiSuccess {Number} data.value Parking location street
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     "total": 1,
 *     "limit": 10,
 *     "skip": 0,
 *     "page": 1,
 *     "pages": 1,
 *     "data": [
 *        {
 *           "_id": "5c3952908a9006255159db5a",
 *           "car": {
 *               "_id": "5c39096bbd8b11210592bc40",
 *               "type": "Normal",
 *               "registration": "AA-34-21"
 *           },
 *           "user": {
 *               "_id": "5c37d508ab8bb3037b5ddf7e",
 *               "name": "Edgar Guest",
 *               "emial": "eg@as.pt"
 *           },
 *           "parking": {
 *               "_id": "5c3917474328e92224f75b43",
 *               "city": "5c391473581fff2206070bd2",
 *               "location": {
 *                   "street": "Innovation Row",
 *                   "coordinates": [
 *                       40.72020106,
 *                       -73.98468018
 *                   ]
 *               },
 *               "type": "Normal"
 *           },
 *           "entryTime": "2019-01-12T02:36:00.432Z",
 *           "timeExpected": 40,
 *           "valueExpected": 0.4,
 *           "exitTimeExpected": "2019-01-12T03:16:00.432Z",
 *           "exitTime": "2019-01-12T03:35:02.471Z",
 *           "fee": 0,
 *           "value": 0.4
 *       }
 *    ]
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 401 Unauthorized
 * {
 *    "statusCode": 401,
 *    "error": "Unauthorized",
 *    "message": "Auth fail!"
 * }
 * 
 */
router.get('/', CheckAuth.authUserAdmin ,ManagementController.getManagements);
/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /management/exceeded-time List all Managements that exceeded time
 * @apiGroup Management
 * @apiPermission Admin|Func
 * @apiDescription List all managements
 * 
 * @apiSuccess {Number} total Total managements records
 * @apiSuccess {Number} skip Skip managements pagination
 * @apiSuccess {Number} page Page current managements pagination
 * @apiSuccess {Number} pages Total pages
 * 
 * @apiSuccess {Object[]} data Managements list
 * @apiSuccess {String} data._id Management id
 * 
 * @apiSuccess {Object} data.car Management car information
 * @apiSuccess {String} data.car._id Car id
 * @apiSuccess {String} data.car.type Car type
 * @apiSuccess {String} data.car.registration Car registration
 * 
 * @apiSuccess {Object} data.user Management User information
 * @apiSuccess {String} data.user._id User id
 * @apiSuccess {String} data.user.name User name
 * @apiSuccess {String} data.user.email User email
 * 
 * @apiSuccess {Object} data.parking Management Parking information
 * @apiSuccess {String} data.parking._id Parking id
 * @apiSuccess {String} data.parking.city Parking city id
 * @apiSuccess {Object} data.parking.location Parking location information
 * @apiSuccess {String} data.parking.location.street Parking location street
 * @apiSuccess {Number[]} data.parking.location.coordinates Parking location coordinates
 * @apiSuccess {String} data.parking.type Parking type
 * 
 * @apiSuccess {Date} data.entryTime Parking location street
 * @apiSuccess {Number} data.timeExpected Parking location street
 * @apiSuccess {Number} data.valueExpected Parking location street
 * @apiSuccess {Date} data.exitTimeExpected Parking location street
 * @apiSuccess {Date} data.exitTime Parking location street
 * @apiSuccess {Number} data.fee Parking location street
 * @apiSuccess {Number} data.value Parking location street
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     "total": 1,
 *     "limit": 10,
 *     "skip": 0,
 *     "page": 1,
 *     "pages": 1,
 *     "data": [
 *        {
 *           "_id": "5c3952908a9006255159db5a",
 *           "car": {
 *               "_id": "5c39096bbd8b11210592bc40",
 *               "type": "Normal",
 *               "registration": "AA-34-21"
 *           },
 *           "user": {
 *               "_id": "5c37d508ab8bb3037b5ddf7e",
 *               "name": "Edgar Guest",
 *               "emial": "eg@as.pt"
 *           },
 *           "parking": {
 *               "_id": "5c3917474328e92224f75b43",
 *               "city": "5c391473581fff2206070bd2",
 *               "location": {
 *                   "street": "Innovation Row",
 *                   "coordinates": [
 *                       40.72020106,
 *                       -73.98468018
 *                   ]
 *               },
 *               "type": "Normal"
 *           },
 *           "entryTime": "2019-01-12T02:36:00.432Z",
 *           "timeExpected": 40,
 *           "valueExpected": 0.4,
 *           "exitTimeExpected": "2019-01-12T03:16:00.432Z",
 *           "fee": 0
 *       }
 *    ]
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 401 Unauthorized
 * {
 *    "statusCode": 401,
 *    "error": "Unauthorized",
 *    "message": "Auth fail!"
 * }
 * 
 */
router.get('/exceeded-time', CheckAuth.authUserSystem, ManagementController.getManagementExceededTime);
/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {post} /management/:id/check-out Checkout Management
 * @apiGroup Management
 * @apiPermission User
 * @apiDescription Checkout management
 * 
 * @apiParam {String} id Management id
 * 
 * @apiSuccess {Object} data Managements list
 * @apiSuccess {String} data._id Management id
 * 
 * @apiSuccess {Object} data.car Management car information
 * @apiSuccess {String} data.car._id Car id
 * @apiSuccess {String} data.car.type Car type
 * @apiSuccess {String} data.car.registration Car registration
 * 
 * @apiSuccess {Object} data.user Management User information
 * @apiSuccess {String} data.user._id User id
 * @apiSuccess {String} data.user.name User name
 * @apiSuccess {String} data.user.email User email
 * 
 * @apiSuccess {Object} data.parking Management Parking information
 * @apiSuccess {String} data.parking._id Parking id
 * @apiSuccess {String} data.parking.city Parking city id
 * @apiSuccess {Object} data.parking.location Parking location information
 * @apiSuccess {String} data.parking.location.street Parking location street
 * @apiSuccess {Number[]} data.parking.location.coordinates Parking location coordinates
 * @apiSuccess {String} data.parking.type Parking type
 * 
 * @apiSuccess {Date} data.entryTime Parking location street
 * @apiSuccess {Number} data.timeExpected Parking location street
 * @apiSuccess {Number} data.valueExpected Parking location street
 * @apiSuccess {Date} data.exitTimeExpected Parking location street
 * @apiSuccess {Date} data.exitTime Parking location street
 * @apiSuccess {Number} data.fee Parking location street
 * @apiSuccess {Number} data.value Parking location street
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     "data":
 *        {
 *           "_id": "5c3952908a9006255159db5a",
 *           "car": {
 *               "_id": "5c39096bbd8b11210592bc40",
 *               "type": "Normal",
 *               "registration": "AA-34-21"
 *           },
 *           "user": {
 *               "_id": "5c37d508ab8bb3037b5ddf7e",
 *               "name": "Edgar Guest",
 *               "emial": "eg@as.pt"
 *           },
 *           "parking": {
 *               "_id": "5c3917474328e92224f75b43",
 *               "city": "5c391473581fff2206070bd2",
 *               "location": {
 *                   "street": "Innovation Row",
 *                   "coordinates": [
 *                       40.72020106,
 *                       -73.98468018
 *                   ]
 *               },
 *               "type": "Normal"
 *           },
 *           "entryTime": "2019-01-12T02:36:00.432Z",
 *           "timeExpected": 40,
 *           "valueExpected": 0.4,
 *           "exitTimeExpected": "2019-01-12T03:16:00.432Z",
 *           "exitTime": "2019-01-12T03:35:02.471Z",
 *           "fee": 0,
 *           "value": 0.4
 *       }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 401 Unauthorized
 * {
 *    "statusCode": 401,
 *    "error": "Unauthorized",
 *    "message": "Auth fail!"
 * }
 * 
 */
router.post('/:id/check-out', CheckAuth.authUser, ManagementController.postManagementCheckout);
/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {post} /management/:id/fee Apply fee to Management
 * @apiGroup Management
 * @apiPermission Admin|Func
 * @apiDescription Apply fee to management
 * 
 * @apiParam {String} id Management id
 * @apiParam (Request body) {Number} feeValue Fee Value (if null aplly fee base on time extended)
 * 
 * @apiSuccess {Object} data Managements list
 * @apiSuccess {String} data._id Management id
 * 
 * @apiSuccess {Object} data.car Management car information
 * @apiSuccess {String} data.car._id Car id
 * @apiSuccess {String} data.car.type Car type
 * @apiSuccess {String} data.car.registration Car registration
 * 
 * @apiSuccess {Object} data.user Management User information
 * @apiSuccess {String} data.user._id User id
 * @apiSuccess {String} data.user.name User name
 * @apiSuccess {String} data.user.email User email
 * 
 * @apiSuccess {Object} data.parking Management Parking information
 * @apiSuccess {String} data.parking._id Parking id
 * @apiSuccess {String} data.parking.city Parking city id
 * @apiSuccess {Object} data.parking.location Parking location information
 * @apiSuccess {String} data.parking.location.street Parking location street
 * @apiSuccess {Number[]} data.parking.location.coordinates Parking location coordinates
 * @apiSuccess {String} data.parking.type Parking type
 * 
 * @apiSuccess {Date} data.entryTime Parking location street
 * @apiSuccess {Number} data.timeExpected Parking location street
 * @apiSuccess {Number} data.valueExpected Parking location street
 * @apiSuccess {Date} data.exitTimeExpected Parking location street
 * @apiSuccess {Number} data.fee Parking location street
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     "data":
 *        {
 *           "_id": "5c3952908a9006255159db5a",
 *           "car": {
 *               "_id": "5c39096bbd8b11210592bc40",
 *               "type": "Normal",
 *               "registration": "AA-34-21"
 *           },
 *           "user": {
 *               "_id": "5c37d508ab8bb3037b5ddf7e",
 *               "name": "Edgar Guest",
 *               "emial": "eg@as.pt"
 *           },
 *           "parking": {
 *               "_id": "5c3917474328e92224f75b43",
 *               "city": "5c391473581fff2206070bd2",
 *               "location": {
 *                   "street": "Innovation Row",
 *                   "coordinates": [
 *                       40.72020106,
 *                       -73.98468018
 *                   ]
 *               },
 *               "type": "Normal"
 *           },
 *           "entryTime": "2019-01-12T02:36:00.432Z",
 *           "timeExpected": 40,
 *           "valueExpected": 0.4,
 *           "exitTimeExpected": "2019-01-12T03:16:00.432Z",
 *           "fee": 1
 *       }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * @apiError BadRequest Missing time expected (timeExpected)!
 * @apiError NotFound Management not found!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 401 Unauthorized
 * {
 *    "statusCode": 401,
 *    "error": "Unauthorized",
 *    "message": "Auth fail!"
 * }
 * 
 */
router.post('/:id/fee', ManagementController.postManagementFee);
/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /management/:id Management information
 * @apiGroup Management
 * @apiPermission Admin
 * @apiDescription List management information
 * 
 * @apiParam {String} id Management id
 * 
 * @apiSuccess {Object} data Managements list
 * @apiSuccess {String} data._id Management id
 * 
 * @apiSuccess {Object} data.car Management car information
 * @apiSuccess {String} data.car._id Car id
 * @apiSuccess {String} data.car.type Car type
 * @apiSuccess {String} data.car.registration Car registration
 * 
 * @apiSuccess {Object} data.user Management User information
 * @apiSuccess {String} data.user._id User id
 * @apiSuccess {String} data.user.name User name
 * @apiSuccess {String} data.user.email User email
 * 
 * @apiSuccess {Object} data.parking Management Parking information
 * @apiSuccess {String} data.parking._id Parking id
 * @apiSuccess {String} data.parking.city Parking city id
 * @apiSuccess {Object} data.parking.location Parking location information
 * @apiSuccess {String} data.parking.location.street Parking location street
 * @apiSuccess {Number[]} data.parking.location.coordinates Parking location coordinates
 * @apiSuccess {String} data.parking.type Parking type
 * 
 * @apiSuccess {Date} data.entryTime Parking location street
 * @apiSuccess {Number} data.timeExpected Parking location street
 * @apiSuccess {Number} data.valueExpected Parking location street
 * @apiSuccess {Date} data.exitTimeExpected Parking location street
 * @apiSuccess {Date} data.exitTime Parking location street
 * @apiSuccess {Number} data.fee Parking location street
 * @apiSuccess {Number} data.value Parking location street
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     "data":
 *        {
 *           "_id": "5c3952908a9006255159db5a",
 *           "car": {
 *               "_id": "5c39096bbd8b11210592bc40",
 *               "type": "Normal",
 *               "registration": "AA-34-21"
 *           },
 *           "user": {
 *               "_id": "5c37d508ab8bb3037b5ddf7e",
 *               "name": "Edgar Guest",
 *               "emial": "eg@as.pt"
 *           },
 *           "parking": {
 *               "_id": "5c3917474328e92224f75b43",
 *               "city": "5c391473581fff2206070bd2",
 *               "location": {
 *                   "street": "Innovation Row",
 *                   "coordinates": [
 *                       40.72020106,
 *                       -73.98468018
 *                   ]
 *               },
 *               "type": "Normal"
 *           },
 *           "entryTime": "2019-01-12T02:36:00.432Z",
 *           "timeExpected": 40,
 *           "valueExpected": 0.4,
 *           "exitTimeExpected": "2019-01-12T03:16:00.432Z",
 *           "exitTime": "2019-01-12T03:35:02.471Z",
 *           "fee": 0,
 *           "value": 0.4
 *       }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 401 Unauthorized
 * {
 *    "statusCode": 401,
 *    "error": "Unauthorized",
 *    "message": "Auth fail!"
 * }
 * 
 */
router.get('/:id', CheckAuth.authUser, ManagementController.getManagement);
/*
  ########################################################################################################
  ########################################################################################################
*/
/**
 * @api {patch} /management/:id Update Management
 * @apiGroup Management
 * @apiPermission Admin
 * @apiDescription Extend time of management
 * 
 * @apiParam {String} id Management id
 * @apiParam (Request body) {Number} timeExpected Time to extend Reserve Expected time (min)
 * 
 * @apiSuccess {Object} data Managements list
 * @apiSuccess {String} data._id Management id
 * 
 * @apiSuccess {Object} data.car Management car information
 * @apiSuccess {String} data.car._id Car id
 * @apiSuccess {String} data.car.type Car type
 * @apiSuccess {String} data.car.registration Car registration
 * 
 * @apiSuccess {Object} data.user Management User information
 * @apiSuccess {String} data.user._id User id
 * @apiSuccess {String} data.user.name User name
 * @apiSuccess {String} data.user.email User email
 * 
 * @apiSuccess {Object} data.parking Management Parking information
 * @apiSuccess {String} data.parking._id Parking id
 * @apiSuccess {String} data.parking.city Parking city id
 * @apiSuccess {Object} data.parking.location Parking location information
 * @apiSuccess {String} data.parking.location.street Parking location street
 * @apiSuccess {Number[]} data.parking.location.coordinates Parking location coordinates
 * @apiSuccess {String} data.parking.type Parking type
 * 
 * @apiSuccess {Date} data.entryTime Parking location street
 * @apiSuccess {Number} data.timeExpected Parking location street
 * @apiSuccess {Number} data.valueExpected Parking location street
 * @apiSuccess {Date} data.exitTimeExpected Parking location street
 * @apiSuccess {Number} data.fee Parking location street
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     "data":
 *        {
 *           "_id": "5c3952908a9006255159db5a",
 *           "car": {
 *               "_id": "5c39096bbd8b11210592bc40",
 *               "type": "Normal",
 *               "registration": "AA-34-21"
 *           },
 *           "user": {
 *               "_id": "5c37d508ab8bb3037b5ddf7e",
 *               "name": "Edgar Guest",
 *               "emial": "eg@as.pt"
 *           },
 *           "parking": {
 *               "_id": "5c3917474328e92224f75b43",
 *               "city": "5c391473581fff2206070bd2",
 *               "location": {
 *                   "street": "Innovation Row",
 *                   "coordinates": [
 *                       40.72020106,
 *                       -73.98468018
 *                   ]
 *               },
 *               "type": "Normal"
 *           },
 *           "entryTime": "2019-01-12T02:36:00.432Z",
 *           "timeExpected": 40,
 *           "valueExpected": 0.4,
 *           "exitTimeExpected": "2019-01-12T03:16:00.432Z",
 *           "fee": 0
 *       }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * @apiError BadRequest Missing time expected (timeExpected)!
 * @apiError NotFound Management not found!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 401 Unauthorized
 * {
 *    "statusCode": 401,
 *    "error": "Unauthorized",
 *    "message": "Auth fail!"
 * }
 * 
 */
router.patch('/:id', CheckAuth.authUser, ManagementController.patchManagementReserve);


module.exports = router;