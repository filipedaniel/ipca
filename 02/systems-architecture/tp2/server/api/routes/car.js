var express = require('express');
var router = express.Router();

const CarController = require('../controllers/car');
const CheckAuth = require('../middleware/check-auth');

/**
 * @api {get} /car List all Cars
 * @apiGroup Car
 * @apiPermission authUserAdmin
 * @apiDescription List of all cars
 * 
 * @apiSuccess {Number} total Total cars records
 * @apiSuccess {Number} skip Skip cars pagination
 * @apiSuccess {Number} page Page current cars pagination
 * @apiSuccess {Number} pages Total pages
 * @apiSuccess {Object[]} data Cars list
 * @apiSuccess {String} data._id Car id
 * @apiSuccess {String} data.type Car type
 * @apiSuccess {String} data.registration Car registration
 * @apiSuccess {Object} data.user Car user information
 * @apiSuccess {String} data.user._id Car user id
 * @apiSuccess {String} data.user.name Car user name
 * @apiSuccess {String} data.user.email Car user email
 * @apiSuccess {String} data.user.type Car user type
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *      "total": 1,
 *      "limit": 10,
 *      "skip": 0,
 *      "page": 1,
 *      "pages": 1,
 *      "data": [{
 *          "_id": "5c39096bbd8b11210592bc40",
 *          "registration": "AA-34-21",
 *          "type": "Normal",
 *          "user": {
 *             "_id": "5c37d508ab8bb3037b5ddf7e",
 *             "name": "Edgar Guest",
 *             "email": "eg@as.pt",
 *             "type": "User"
 *           }
 *      }]
 * }
 */
router.get('/', CheckAuth.authUserAdmin , CarController.getCars);

/*
  ########################################################################################################
  ########################################################################################################
*/


/**
 * @api {get} /car/:id List a Car
 * @apiGroup Car
 * @apiParam {String} id Car id
 * @apiPermission authUserAdmin
 * @apiDescription Car information

 * @apiSuccess {Object} data Car infortmation
 * @apiSuccess {String} data._id Car id
 * @apiSuccess {String} data.type Car type
 * @apiSuccess {String} data.registration Car registration
 * @apiSuccess {Object} data.user Car user information
 * @apiSuccess {String} data.user._id Car user id
 * @apiSuccess {String} data.user.name Car user name
 * @apiSuccess {String} data.user.email Car user email
 * @apiSuccess {String} data.user.type Car user type
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    "data": {
 *       "_id": "5c39096bbd8b11210592bc40",
 *       "registration": "AA-34-21",
 *       "type": "Normal",
 *       "user": {
 *           "_id": "5c37d508ab8bb3037b5ddf7e",
 *           "name": "Edgar Guest",
 *           "email": "eg@as.pt",
 *           "type": "User"
 *        }
 *    }
 * }
 * 
 * @apiError NotFound 404 - Car not found!

 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 404 Not Found
 * {
 *    "statusCode": 404,
 *    "error": "Not Found",
 *    "message": "Car not found!"
 * }
 */
router.get('/:id', CheckAuth.authUserAdmin, CarController.getCar);

module.exports = router;
