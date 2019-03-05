var express = require('express');
var router = express.Router();

const AuthController = require('../controllers/auth');
const CheckAuth = require('../middleware/check-auth');

/**
 * @api {post} /auth/signup Signup
 * @apiGroup Auth
 * @apiPermission none
 * @apiDescription Signup new user
 * @apiSuccess {String} token Signup token
 * 
 * @apiParam (Request body) {String} name Username
 * @apiParam (Request body) {Sting} email User e-mail
 * @apiParam (Request body) {Sting} password User password
 * @apiParam (Request body) {Sting} nif User nif
 * @apiParam (Request body) {Number} balance User balance
 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK 
 * {
 *    "token": "eyJhbGciOiJIUzI1Ni......"
 * }
 * @apiError BadRequest 400 - E-mail not valid!
 * @apiError Unauthorized 401 - There is already an user with that email adress in the database!
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 400 Bad Request 
 * {
 *    "statusCode": 400,
 *    "error": "Bad Request",
 *    "message": "E-mail not valid!"
 * }
 */
router.post('/signup', AuthController.signup);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {post} /auth/login Login
 * @apiGroup Auth
 * @apiPermission none
 * @apiDescription User login
 * @apiSuccess {String} token Login token
 * 
 * @apiParam (Request body) {Sting} email User e-mail
 * @apiParam (Request body) {Sting} password User password
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK 
 * {
 *    "token": "eyJhbGciOiJIUzI1Ni......"
 * }
 * 
 * @apiError BadRequest 400 - E-mail not valid!
 * @apiError Unauthorized 401 - Email or Password invalid!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 400 Bad Request 
 * {
 *    "statusCode": 400,
 *    "error": "Bad Request",
 *    "message": "E-mail not valid!"
 * }
 */
router.post('/login', AuthController.login);

/*
  ########################################################################################################
  ########################################################################################################
*/

/**
 * @api {get} /auth/user User
 * @apiGroup Auth
 * @apiPermission authUser
 * @apiDescription User information
 * @apiSuccess {String} _id User id
 * @apiSuccess {String} name User name
 * @apiSuccess {String} email User email
 * @apiSuccess {Number} nif User nif
 * @apiSuccess {Number} balance User balance
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK 
 * {
 *    "_id": "5c37d539ab8bb3037b5ddf81",
 *    "name": "Jhon Doe",
 *    "email": "jd@as.pt",
 *    "type": "Admin",
 *    "nif": 123123123,
 *    "balance": 10,
 * }
 * 
 * @apiError NotFound 404 - User not found!
 * 
 * @apiErrorExample {json} Error (Example)
 * HTTP/1.1 404 Not Found
 * {
 *    "statusCode": 404,
 *    "error": "Not Found",
 *    "message": "User not found!"
 * }
 */
router.get('/user', CheckAuth.authUser ,AuthController.user);

module.exports = router;
