const boom = require('boom');
const jwt = require('jsonwebtoken');
var GLOBAL_CONFIGS = require('../../app.config');

/**
 * Check if auth is Valid and "Admin"
 */
exports.authUserAdmin =  (req, res, next) => {
  if (!req.headers.authorization)
    return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));
    
  try {
    var token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, GLOBAL_CONFIGS.authentication.jwtKey);
  
    if (decoded.type != "Admin")
      return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));

    req.userData = decoded;
    next();
  } catch (error) {
    if (!error.isBoom)
      return next(boom.unauthorized("Auth fail!"));
    next(error);
  }
}

/**
 * Check if auth is Valid and "Func"
 */
exports.authUserFunc =  (req, res, next) => {
  if (!req.headers.authorization)
    return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));
    
  try {
    var token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, GLOBAL_CONFIGS.authentication.jwtKey);
  
    if (decoded.type != "Func")
      return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));

    req.userData = decoded;
    next();
  } catch (error) {
    if (!error.isBoom)
      return next(boom.unauthorized("Auth fail!"));
    next(error);
  }
}

/**
 * Check if auth is Valid and "User"
 */
exports.authUserUser =  (req, res, next) => {
  if (!req.headers.authorization)
    return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));
    
  try {
    var token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, GLOBAL_CONFIGS.authentication.jwtKey);
  
    if (decoded.type != "User")
      return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));

    req.userData = decoded;
    next();
  } catch (error) {
    if (!error.isBoom)
      return next(boom.unauthorized("Auth fail!"));
    next(error);
  }
}

/**
 * Check if auth is Valid and "Admin"
 */
exports.authUser =  (req, res, next) => {
  if (!req.headers.authorization)
    return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));
    
  try {
    var token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, GLOBAL_CONFIGS.authentication.jwtKey);
    req.userData = decoded;
    next();
  } catch (error) {
    if (!error.isBoom)
      return next(boom.unauthorized("Auth fail!"));
    next(error);
  }
}

/**
 * Check if auth is Valid and "Admin" || "Func"
 */
exports.authUserSystem =  (req, res, next) => {
  if (!req.headers.authorization)
    return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));
    
  try {
    var token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, GLOBAL_CONFIGS.authentication.jwtKey);

    if (decoded.type != "Func" && decoded.type != "Admin")
      return next(boom.unauthorized("Unhauthorized, you dont have credentials to access!"));

    req.userData = decoded;
    next();
  } catch (error) {
    if (!error.isBoom)
      return next(boom.unauthorized("Auth fail!"));
    next(error);
  }
}