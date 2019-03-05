const express = require('express');
const router = express.Router();

const CheckAuth = require('../middleware/check-auth');

const ParkingController = require('../controllers/parking');
const CityController = require('../controllers/city');

/**
 * @api {get} /parking List all Parkings
 * @apiGroup Parking
 * @apiPermission none
 * @apiDescription List of all parkings
 * 
 * @apiSuccess {Number} total Total cars records
 * @apiSuccess {Number} skip Skip cars pagination
 * @apiSuccess {Number} page Page current cars pagination
 * @apiSuccess {Number} pages Total pages
 * @apiSuccess {Object[]} data Parking list
 
 * @apiSuccess {String} data._id Parking id
 * @apiSuccess {Object} data.city Parking city information
 * @apiSuccess {String} data.city._id Parking city id
 * @apiSuccess {String} data.city.description Parking city description
 * @apiSuccess {Number} data.city.price Parking city price
 * @apiSuccess {Number} data.city.fee Parking city fee
 * @apiSuccess {Object} data.location Parking location information
 * @apiSuccess {String} data.location.street Parking location street
 * @apiSuccess {Number[]} data.location.coordinates Parking location coordinates
 * @apiSuccess {String} data.type Parking type
 * @apiSuccess {Boolean} data.taken Parking is taken or not
 * @apiSuccess {String} data.dist Distance information
 * @apiSuccess {String} data.dist.calculated Distance from query lat e long
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *      "total": 1,
 *      "limit": 10,
 *      "skip": 0,
 *      "page": 1,
 *      "pages": 1,
 *      "data": [{
 *           "_id": "5c3916db4328e92224f75b42",
 *           "city": {
 *               "fee": 0.01,
 *               "_id": "5c391473581fff2206070bd2",
 *               "description": "Slamlas",
 *               "price": 0.01,
 *               "__v": 0
 *           },
 *           "location": {
 *               "street": "River Avenue",
 *               "coordinates": [
 *                   41.5365137,
 *                   -8.6301066
 *               ]
 *           },
 *           "type": "Transport",
 *           "taken": false,
 *           "dist": {
 *              calculated: 361.35
 *            }
 *     }]
 * }
 * 
 * @apiError BadRequest  BadRequest  Missing 'lat' and 'lng'!
 * @apiError BadRequest  Missing 'lat'!
 * @apiError BadRequest  Missing 'lng'!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 400 Bad Request
 * {
 *    "statusCode": 400,
 *    "error": "Bad Request",
 *    "message": "Missing 'lat' and 'lng'!"
 * }
 */
router.get('/', ParkingController.getParkings);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /parking/status Parking status
 * @apiGroup Parking
 * @apiPermission authUserAdmin
 * @apiDescription Parking status information
 *
 * @apiSuccess {Object} data Parking status
 * @apiSuccess {Number} data.total Total parks
 * @apiSuccess {Number} data.taken Total parks taken
 * @apiSuccess {Number} data.notTaken Total parks available
 * @apiSuccess {Object} data.types Parking status by type
 * @apiSuccess {Object} data.types.normal Parking status type "Normal"
 * @apiSuccess {Number} data.types.normal.total Total "Normal" parks
 * @apiSuccess {Number} data.types.normal.taken Total "Normal" parks taken
 * @apiSuccess {Number} data.types.normal.notTaken Total "Normal" parks available
 * @apiSuccess {Object} data.types.special Parking status type "Special"
 * @apiSuccess {Number} data.types.special.total Total "Special" parks
 * @apiSuccess {Number} data.types.special.taken Total "Special" parks taken
 * @apiSuccess {Number} data.types.special.notTaken Total "Special" parks available
 * @apiSuccess {Object} data.types.transport Parking status type "Transport"
 * @apiSuccess {Number} data.types.transport.total Total "Transport" parks
 * @apiSuccess {Number} data.types.transport.taken Total "Transport" parks taken
 * @apiSuccess {Number} data.types.transport.notTaken Total "Transport" parks available
 * @apiSuccess {Object} data.types.electric Parking status type "Electric"
 * @apiSuccess {Number} data.types.electric.total Total "Electric" parks
 * @apiSuccess {Number} data.types.electric.taken Total "Electric" parks taken
 * @apiSuccess {Number} data.types.electric.notTaken Total "Electric" parks available
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   "data": {
 *      "total": 7,
 *      "taken": 1,
 *      "notTaken": 6,
 *      "types": {
 *          "normal": {
 *              "total": 4,
 *              "taken": 0,
 *              "notTaken": 4
 *          },
 *          "special": {
 *              "total": 2,
 *              "taken": 1,
 *              "notTaken": 1
 *          },
 *          "transport": {
 *              "total": 1,
 *              "taken": 0,
 *              "notTaken": 1
 *          },
 *          "electric": {
 *              "total": 0,
 *              "taken": 0,
 *              "notTaken": 0
 *          }
 *      }
 *   }
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
router.get('/status', CheckAuth.authUserAdmin, ParkingController.getParkingStatus);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /parking/:id Park information
 * @apiGroup Parking
 * @apiPermission none
 * @apiDescription Information of a Park
 * @apiParam {String} id Parking id
 * @apiSuccess {Object} data Parking list
 * @apiSuccess {String} data._id Parking id
 * @apiSuccess {Object} data.city Parking city information
 * @apiSuccess {String} data.city._id Parking city id
 * @apiSuccess {String} data.city.description Parking city description
 * @apiSuccess {Number} data.city.price Parking city price
 * @apiSuccess {Number} data.city.fee Parking city fee
 * @apiSuccess {Object} data.location Parking location information
 * @apiSuccess {String} data.location.street Parking location street
 * @apiSuccess {Number[]} data.location.coordinates Parking location coordinates
 * @apiSuccess {String} data.type Parking type
 * @apiSuccess {Boolean} data.taken Parking is taken or not
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
  *    "data": {
  *         "_id": "5c3916db4328e92224f75b42",
  *         "city": {
  *             "fee": 0.01,
  *             "_id": "5c391473581fff2206070bd2",
  *             "description": "Slamlas",
  *             "price": 0.01,
  *             "__v": 0
  *         },
  *         "location": {
  *             "street": "River Avenue",
  *             "coordinates": [
  *                 41.5365137,
  *                 -8.6301066
  *             ]
  *         },
  *         "type": "Transport",
  *         "taken": false
  *   }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * @apiError NotFound  Parking not found!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 404 Not Found
 * {
 *    "statusCode": 404,
 *    "error": "Not Found",
 *    "message": "Parking not found!"
 * }
 */
router.get('/:id', ParkingController.getParking);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {post} /parking/:id/reserve Reserve Parking
 * @apiGroup Parking
 * @apiPermission authUserUser
 * @apiDescription Reserve Parking
 * 
 * @apiParam {String} id Parking id
 * 
 * @apiParam (Request body) {String} car Car id
 * @apiParam (Request body) {Number} timeExpected Reserve Expected time (min)
 *
 * @apiSuccess {Object} data Parking reserve information
 * @apiSuccess {String} data._id Management id
 * @apiSuccess {String} data.user User id
 * @apiSuccess {String} data.car Car id
 * @apiSuccess {String} data.parking Parking id
 * @apiSuccess {Date} data.entryTime Date of entry time
 * @apiSuccess {Number} data.timeExpected Reserve expected time
 * @apiSuccess {Number} data.valueExpected Reserve expected value
 * @apiSuccess {String} data.exitTimeExpected Reserve expected time
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   "data": {
 *      "_id": "5c3b754fa8fd300836b9bc7c",
 *      "user": "5c37d508ab8bb3037b5ddf7e",
 *      "car": "5c390976bd8b11210592bc41",
 *      "parking": "5c3918564328e92224f75b48",
 *      "entryTime": "2019-01-13T17:28:47.736Z",
 *      "timeExpected": 40,
 *      "valueExpected": 8,
 *      "exitTimeExpected": "2019-01-13T18:08:47.736Z"
 *   }
 * }
 * @apiError BadRequest [Car missing, Expected time missing!, User balance lower or equal then 0!, Parking Transport type not authorized!, Parking Electric type not authorized!, Parking Special type not authorized!]!
 * @apiError NotFound  [Car not found!, Parking not found! 
 * @apiError MethodNotAllowed  Parking already taken!
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 400 Bad Request
 * {
 *    "statusCode": 400,
 *    "error": "Bad Request",
 *    "message": "Car missing"
 * }
 */
router.post('/:id/reserve', CheckAuth.authUserUser, CityController.postParkingReserve);

module.exports = router;