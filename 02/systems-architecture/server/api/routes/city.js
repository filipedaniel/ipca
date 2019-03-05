var express = require('express');
var router = express.Router();

const CityController = require('../controllers/city');
const CheckAuth = require('../middleware/check-auth');

/**
 * @api {get} /city List all cities
 * @apiGroup City
 * @apiPermission none
 * @apiDescription List of all cities
 * 
 * @apiSuccess {Number} total Total cars records
 * @apiSuccess {Number} skip Skip cars pagination
 * @apiSuccess {Number} page Page current cars pagination
 * @apiSuccess {Number} pages Total pages
 * @apiSuccess {Object[]} data Parking list
 * @apiSuccess {String} data._id City id
 * @apiSuccess {String} data.description City description
 * @apiSuccess {Number} data.price City price
 * @apiSuccess {Number} data.fee City fee
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
 *          "_id": "5c391473581fff2206070bd2",
 *          "description": "Slamlas",
 *          "price": 0.01,
 *          "fee": 0.01
 *     }]
 * }
 * 
 */
router.get('/', CityController.getCities);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {post} /city List all cities
 * @apiGroup City
 * @apiPermission Admin
 * @apiDescription Post new city
 * 
* @apiParam (Request body) {String} description City description
* @apiParam (Request body) {Number} price City base parking price (min)
* @apiParam (Request body) {Number} fee City base parking fee (min)
 * 
 * @apiSuccess {Object} data Parking list
 * @apiSuccess {String} data._id City id
 * @apiSuccess {String} data.description City description
 * @apiSuccess {Number} data.price City price
 * @apiSuccess {Number} data.fee City fee
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *      "data": {
 *          "_id": "5c391473581fff2206070bd2",
 *          "description": "Slamlas",
 *          "price": 0.01,
 *          "fee": 0.01
 *     }
 * }
 * 
 */
router.post('/', CheckAuth.authUserAdmin ,CityController.postCity);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /city/:id List City information
 * @apiGroup City
 * @apiPermission none
 * @apiDescription List city information
 * 
 * @apiParam {String} id City id
 * 
 * @apiSuccess {Object} data Parking list
 * @apiSuccess {String} data._id City id
 * @apiSuccess {String} data.description City description
 * @apiSuccess {Number} data.price City price
 * @apiSuccess {Number} data.fee City fee
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    "data": {
 *        "_id": "5c391473581fff2206070bd2",
 *        "description": "Slamlas",
 *        "price": 0.01,
 *        "fee": 0.01
 *     }
 * }
 * 
 * @apiError NotFound City not found!
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 404 NotFound
 * {
 *    "statusCode": 404,
 *    "error": "Not Found",
 *    "message": "City not found!"
 * }
 */
router.get('/:id', CityController.getCity);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {patch} /city/:id Patch city
 * @apiGroup City
 * @apiPermission Admin
 * @apiDescription Patch city information
 * 
 * @apiParam {String} id City id
 * 
 * @apiParam (Request body) {String} description City description
 * @apiParam (Request body) {Number} price City base parking price (min)
 * @apiParam (Request body) {Number} fee City base parking fee (min)
 * 
 * @apiSuccess {Object} data Parking list
 * @apiSuccess {String} data._id City id
 * @apiSuccess {String} data.description City description
 * @apiSuccess {Number} data.price City price
 * @apiSuccess {Number} data.fee City fee
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *      "data": {
 *          "_id": "5c391473581fff2206070bd2",
 *          "description": "Slamlas",
 *          "price": 0.01,
 *          "fee": 0.01
 *     }
 * }
 * 
 * @apiError NotFound City not found!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 404 NotFound
 * {
 *    "statusCode": 404,
 *    "error": "Not Found",
 *    "message": "City not found!"
 * }
 * 
 */
router.patch('/:id', CheckAuth.authUserAdmin, CityController.patchCity);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /city/:id/parking List all Parkings of a City
 * @apiGroup City
 * @apiPermission none
 * @apiDescription List of all parkings of one City
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
 *           "taken": false
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
router.get('/:id/parking', CityController.getCityParkings);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {post} /city/:id/parking Post new Parking
 * @apiGroup City
 * @apiPermission Admin
 * @apiDescription List of all parkings of one City
 * 
 * @apiParam {String} id City id
 * 
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
 *     "data": {
 *         "_id": "5c3916db4328e92224f75b42",
 *         "city": {
 *             "fee": 0.01,
 *             "_id": "5c391473581fff2206070bd2",
 *             "description": "Slamlas",
 *             "price": 0.01,
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
 *    }
 * }
 * 
 * @apiError NotFound  City not found!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 404 Not Found
 * {
 *    "statusCode": 404,
 *    "error": "Not Found",
 *    "message": "City not found!"
 * }
 */
router.post('/:id/parking', CheckAuth.authUserAdmin, CityController.postCityParking);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /city/:id/parking/status City Parking status
 * @apiGroup City
 * @apiPermission Admin
 * @apiDescription City Parking status information
 *
 * @apiParam {String} id City id
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
router.get('/:id/parking/status', CheckAuth.authUserAdmin, CityController.getCityParkingStatus);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /city/:id/parking/:idParking City parking Information
 * @apiGroup City
 * @apiPermission none
 * @apiDescription Get City Parking information
 * 
 * @apiParam {String} id City id
 * @apiParam {String} idParking Parking id
 * 
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
 * @apiError NotFound  City not found!
 * @apiError NotFound  Parking not found!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 404 Not Found
 * {
 *    "statusCode": 404,
 *    "error": "Not Found",
 *    "message": "City not found!"
 * }
 */
router.get('/:id/parking/:idParking', CityController.getCityParking);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {patch} /city/:id/parking/:idParking Patch City parking Information
 * @apiGroup City
 * @apiPermission Admin
 * @apiDescription Patch City Parking by id
 * 
 * @apiParam {String} id City id
 * @apiParam {String} idParking Parking id
 * 
 * @apiParam (Request body) {String} type Parking type
 * @apiParam (Request body) {String} street Parking street
 * @apiParam (Request body) {Number[]} coordinates Parking coordinates
 * 
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
router.patch('/:id/parking/:idParking', CheckAuth.authUserAdmin , CityController.patchCityParking);

/*
  ########################################################################################################
  ########################################################################################################
*/

/* delete city parking by id */
/**
 * @api {delete} /city/:id/parking/:idParking Delete City Parking
 * @apiGroup City
 * @apiPermission Admin
 * @apiDescription Delete Parking
 * 
 * @apiParam {String} id City id
 * @apiParam {String} idParking Parking id
 * 
 * @apiSuccess {Object} data return information
 * @apiSuccess {String} data.message Deleted message
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     data: {
*         "message": "Parking deleted!"
 *     }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * @apiError NotFound parking not found!
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
router.delete('/:id/parking/:idParking', CheckAuth.authUserAdmin ,CityController.deleteCityParking);


module.exports = router;
