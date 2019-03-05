const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

const CheckAuth = require('../middleware/check-auth');

/**
 * @api {get} /user List all User
 * @apiGroup User
 * @apiPermission Admin
 * @apiDescription List of all Users
 * 
 * @apiSuccess {Object[]} data Users list
 * @apiSuccess {String} data._id User id
 * @apiSuccess {String} data.name User name
 * @apiSuccess {String} data.email User email
 * @apiSuccess {String} data.type User type
 * @apiSuccess {Number} data.nif User nif number
 * @apiSuccess {Number} data.balance User balance
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    "data": [{
 *       "_id": "5c37d508ab8bb3037b5ddf7e",
 *       "name": "Edgar Guest",
 *       "email": "eg@as.pt",
 *       "type": "User",
 *       "nif": 123123123,
 *       "balance": 30
 *    }]
 * }
 *
 */
router.get('/', CheckAuth.authUserAdmin, UserController.getUsers);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /user/management List managements of a User
 * @apiGroup User
 * @apiPermission User
 * @apiDescription List managements of the login user
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
 *     data: [
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
router.get('/management', CheckAuth.authUser, UserController.getUserManagement);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /user/car List cars of a User
 * @apiGroup User
 * @apiPermission User
 * @apiDescription List cars of the login user
 * 
 * @apiSuccess {Object[]} data Cars list
 * @apiSuccess {String} data._id Car id
 * @apiSuccess {Object} data.registration Car information
 * @apiSuccess {String} data.type Car type
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     data: [
 *        {
 *           "_id": "5c3952908a9006255159db5a",
 *           "registration": "AA-34-21",
 *           "type": "Normal",
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
router.get('/car', CheckAuth.authUser, UserController.getUserCars);
/*
  ########################################################################################################
  ########################################################################################################
*/


/**
 * @api {post} /user/car Add user Car
 * @apiGroup User
 * @apiPermission User
 * @apiDescription Add new car to the login user
 * 
 * @apiParam (Request body) {String} registration Car registration
 * @apiParam (Request body) {String} type Car type
 * 
 * @apiSuccess {Object} data Cars list
 * @apiSuccess {String} data._id Car id
 * @apiSuccess {Object} data.registration Car information
 * @apiSuccess {String} data.type Car type
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     data: {
*         "_id": "5c3952908a9006255159db5a",
*         "registration": "AA-34-21",
 *        "type": "Normal",
 *     }
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
router.post('/car', CheckAuth.authUser, UserController.postUserCar);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {patch} /user/car/:idCar Update user Car
 * @apiGroup User
 * @apiPermission User
 * @apiDescription Update user car
 * 
 * @apiParam {String} idCar Car id
 * 
 * @apiParam (Request body) {String} registration Car registration
 * @apiParam (Request body) {String} type Car type
 * 
 * @apiSuccess {Object} data Cars list
 * @apiSuccess {String} data._id Car id
 * @apiSuccess {Object} data.registration Car information
 * @apiSuccess {String} data.type Car type
 * 
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     data: {
*         "_id": "5c3952908a9006255159db5a",
*         "registration": "AA-34-21",
 *        "type": "Normal",
 *     }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * @apiError NotFound Car not found!
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
router.patch('/car/:idCar', CheckAuth.authUser, UserController.patchUserCar);
/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {delete} /user/car/:idCar Delete user Car
 * @apiGroup User
 * @apiPermission User
 * @apiDescription Delete user car
 * 
 * @apiParam {String} idCar Car id
 * 
 * @apiSuccess {Object} data return information
 * @apiSuccess {String} data.message Deleted message
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     data: {
*         "message": "Car deleted!"
 *     }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * @apiError NotFound Car not found!
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
router.delete('/car/:idCar', CheckAuth.authUser, UserController.deleteUserCar);

/*
  ########################################################################################################
  ########################################################################################################
*/


/**
 * @api {get} /user/:id User info
 * @apiGroup User
 * @apiPermission Admin
 * @apiDescription List of info of a user
 * 
 * @apiParam {String} id User id
 * 
 * @apiSuccess {Object} data Users list
 * @apiSuccess {String} data._id User id
 * @apiSuccess {String} data.name User name
 * @apiSuccess {String} data.email User email
 * @apiSuccess {String} data.type User type
 * @apiSuccess {Number} data.nif User nif number
 * @apiSuccess {Number} data.balance User balance
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    "data": {
 *       "_id": "5c37d508ab8bb3037b5ddf7e",
 *       "name": "Edgar Guest",
 *       "email": "eg@as.pt",
 *       "type": "User",
 *       "nif": 123123123,
 *       "balance": 30
 *    }
 * }
 *
 */
router.get('/:id', CheckAuth.authUserAdmin, UserController.getUser);
/*
  ########################################################################################################
  ########################################################################################################
*/


/**
 * @api {patch} /user/:id Update User info
 * @apiGroup User
 * @apiPermission Admin
 * @apiDescription Update info of a user
 * 
 * @apiParam {String} id User id
 * @apiParam (Request body) {String} name User name
 * @apiParam (Request body) {String} type User type
 * @apiParam (Request body) {Number} nif User nif
 * @apiParam (Request body) {Number} balance Add balance
 *
 * @apiSuccess {Object} data Users list
 * @apiSuccess {String} data._id User id
 * @apiSuccess {String} data.name User name
 * @apiSuccess {String} data.email User email
 * @apiSuccess {String} data.type User type
 * @apiSuccess {Number} data.nif User nif number
 * @apiSuccess {Number} data.balance User balance
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    "data": {
 *       "_id": "5c37d508ab8bb3037b5ddf7e",
 *       "name": "Edgar Guest",
 *       "email": "eg@as.pt",
 *       "type": "User",
 *       "nif": 123123123,
 *       "balance": 30
 *    }
 * }
 *
 */
router.patch('/:id', CheckAuth.authUserAdmin, UserController.patchUser);
/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {delete} /user/:id Delete User
 * @apiGroup User
 * @apiPermission Admin
 * @apiDescription Delete User
 * 
 * @apiParam {String} id User id
 * 
 * @apiSuccess {Object} data return info
 * @apiSuccess {String} data.message Deleted message
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     data: {
*         "message": "User deleted!"
 *     }
 * }
 * 
 * @apiError Unauthorized  Auth fail!
 * @apiError NotFound User not found!
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
router.delete('/:id', CheckAuth.authUserAdmin, UserController.deleteUser);


module.exports = router;
