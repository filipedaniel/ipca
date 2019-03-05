const mongoose = require('mongoose');
const aqp = require('api-query-params');
const boom = require('boom');

/**
 * Require modules
 */
const Car = require('../models/car');

/**
 * Require Global API Configs
 */
const GLOBAL_CONFIGS = require('../../app.config.js');


/**
 * Get information of cars
 */
exports.getCars = async (req, res, next) => {
  try {
    let { filter, skip, limit, sort, projection } = aqp(req.query);
    
    limit = limit ? limit : GLOBAL_CONFIGS.defaultVariables.paginationLimit;
    skip = skip ? skip : 0;
    
    let result = await Car.find(filter).sort(sort).skip(skip).limit(limit).select(projection);
    let count = await Car.find(filter).countDocuments();
    
    let pages = 1;
    pages = Math.ceil(count / limit);
    
    let page = 1;
    page = Math.ceil(skip / limit) + 1;
    
    const response = {
      total: count,
      limit: limit,
      skip: skip,
      page: page,
      pages: pages,
      data: result.map(item => {
        return {
          _id: item._id,
          registration: item.registration,
          type: item.type,
          user: {
            _id: item.user._id,
            name: item.user.name,
            email: item.user.email,
            type: item.user.type
          }
        }
      })
    }
    res.status(200).jsonp(response);
  
  } catch (err) {
    if (!err.isBoom) {
      return next(boom.badImplementation(err.message));
    }
    next(err);
  }
}

/**
 * Get information of car
 */
exports.getCar = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { projection } = aqp(req.query);

    let result = await Car.findById(id).select(projection);
    
    if (!result) {
      return next(boom.notFound("Car not found!"));
    }

    res.status(200).jsonp({
      data: {
        _id: result._id,
        registration: result.registration,
        type: result.type,
        user: {
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          type: result.user.type
        }
      }
    })
  } catch (err) {
    if (!err.isBoom) {
      return next(boom.badImplementation(err.message));
    }
    next(err);
  }
}

