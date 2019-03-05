const mongoose = require('mongoose');
const boom = require('boom');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

var GLOBAL_CONFIGS = require('../../app.config');

var User = require('../models/user');

/**
 * Check if is a valid email
 * @param {string} email 
 */
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
 * Create a jwt token base on user information
 * @param {User} user 
 */
function createSendToken(user) {
  let token = jwt.sign({
    userId: user._id,
    email: user.email,
    type: user.type,
  }, GLOBAL_CONFIGS.authentication.jwtKey, {
    expiresIn: "2 days" 
  })
  return token;
}

/**
 * Signup new user
 */
exports.signup = async (req, res, next) => {
  try {
    var userName = req.body.name;
    var userEmail = req.body.email;
    var userType = req.body.type;
    var userPassword = req.body.password;
    var userNif = req.body.nif;
    var userBalance = req.body.balance;
    
    if (!validateEmail(userEmail))
      return next(boom.badRequest("E-mail not valid!"));
  
    let checkIfUserAlreadyExists = await User.findOne({ email: userEmail });
    if (checkIfUserAlreadyExists)
      return next(boom.unauthorized("There is already an user with that email adress in the database!"))
    
    bcrypt.hash(userPassword, bcrypt.genSaltSync(GLOBAL_CONFIGS.authentication.salt), null, async (error,hash) => {

      if (error) {
        return next(boom.badImplementation(error.message));
      }

      try {
        const user = new User ({
          _id: new mongoose.Types.ObjectId(),
          name: userName,
          email: userEmail,
          type: userType,
          password: hash,
          nif: userNif,
          balance: userBalance
        });
  
        let saveUser = await user.save();
        let token = createSendToken(saveUser);
        return res.status(201).jsonp({token})
        
      } catch (er) {
        return next(boom.badRequest(er.message));
      }
    })
  } catch (err) {
    if (!err.isBoom) {
      return next(boom.badImplementation(err.message));
    }
    next(err);
  }
}

/**
 * User login
 */
exports.login = async (req, res, next) => {
  try {
    let userEmail = req.body.email;
    let userPassword = req.body.password;

    if (!validateEmail(userEmail))
      return next(boom.badRequest("E-mail not valid!"));

    let user = await User.findOne({ email: userEmail });
    if (!user)
      return next(boom.unauthorized("Email or Password invalid!"));

    bcrypt.compare(userPassword, user.password, async (error, isMatch) => {
      if (error)
        return next(boom.unauthorized("Email or Password invalid!"));
        
      if (isMatch) {
        let token = await createSendToken(user);
        return res.status(200).jsonp({
          token: token
        })
      }
      return next(boom.unauthorized("Email or Password invalid!"));
    })
  } catch (err) {
    if (!err.isBoom) {
      return next(boom.badImplementation(err.message));
    }
    next(err);
  }
}

/**
 * Get Auth user information
 */
exports.user = async (req, res, next) => {
  
  try {
    const user = await User.findById(req.userData.userId, { password: 0 });
    if (!user)
      return next(boom.notFound("User not found!"));
      
    res.status(200).send(user);
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation("There was a problem finding the user."));
    next(err);
  }
}
