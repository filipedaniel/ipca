const mongoose = require('mongoose');
const aqp = require('api-query-params');
const boom = require('boom');

/**
 * Require modules
 */
const Management = require('../models/management');
const Parking = require('../models/parking');
const City = require('../models/city');
const User = require('../models/user');

/**
 * Require Global API Configs
 */
const GLOBAL_CONFIGS = require('../../app.config.js');


/**
 * GET all managements information
 */
exports.getManagements = async (req, res, next) => {
  try {
    let { filter, skip, limit, sort, projection } = aqp(req.query);
    limit = limit ? limit : GLOBAL_CONFIGS.defaultVariables.paginationLimit;
    skip = skip ? skip : 0;
    
    let result = await Management.find(filter).sort(sort).skip(skip).limit(limit).select(projection).populate('user car parking');
    let count = await Management.find(filter).countDocuments();

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
          car: {
            _id: item.car._id,
            type: item.car.type,
            registration: item.car.registration,
          },
          user: {
            _id: item.user._id,
            name: item.user.name,
            emial: item.user.email
          },
          parking: {
            _id: item.parking._id,
            city: item.parking.city,
            location: item.parking.location,
            type: item.parking.type
          },
          entryTime: item.entryTime,
          timeExpected: item.timeExpected,
          valueExpected: item.valueExpected,
          exitTimeExpected: item.exitTimeExpected,
          exitTime: item.exitTime,
          fee: item.fee,
          value: item.value
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
 * GET all management information
 */
exports.getManagement = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { projection } = aqp(req.query);

    let result = await Management.findById(id).select(projection).populate('car user parking');
    
    if (!result) {
      return next(boom.notFound("Management not found!"));
    }
    res.status(200).jsonp({
      data: {
        _id: result._id,
        car: {
          _id: result.car._id,
          registration: result.car.registration,
          type: result.car.type
        },
        user: {
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email
        },
        parking: {
          _id: result.parking._id,
          location: result.parking.location,
          type: result.parking.type
        },
        entryTime: result.entryTime,
        timeExpected: result.timeExpected,
        valueExpected: result.valueExpected,
        exitTimeExpected: result.exitTimeExpected,
        exitTime: result.exitTime,
        fee: result.fee,
        value: result.value
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
 * Patch Reserve parking by id
 */
exports.patchManagementReserve = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!req.body.timeExpected)
      return next(boom.badRequest("Missing time expected (timeExpected)!"));

    let management = await Management.findById(id).populate('parking');
    management = await Management.populate(management, { 
      path: 'parking.city',
      model: 'City'
    })
    
    if (!management)
    return next(boom.notFound("Management not found!"));
    
    let timeExpected = parseInt(req.body.timeExpected) + management.timeExpected;
    let timeExpectedMs = parseInt(timeExpected) * 60000;
      
    let entryTime = (management.entryTime).getTime();
    let endExpected = (new Date(entryTime + timeExpectedMs)).toISOString(); 

    let update = {
      "timeExpected": timeExpected,
      "exitTimeExpected": endExpected,
      "valueExpected": management.parking.city.price * timeExpected,
    }

    const updateManagement = await Management.findById(id).updateOne({ _id : id },{ $set : update });
    const result = await Management.findById(id).populate('car user parking');

    res.status(200).jsonp({
      data: {
        _id: result._id,
        car: {
          _id: result.car._id,
          registration: result.car.registration,
          type: result.car.type
        },
        user: {
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email
        },
        parking: {
          _id: result.parking._id,
          location: result.parking.location,
          type: result.parking.type
        },
        entryTime: result.entryTime,
        timeExpected: result.timeExpected,
        valueExpected: result.valueExpected,
        exitTimeExpected: result.exitTimeExpected,
        exitTime: result.exitTime,
        fee: result.fee,
        value: result.value
      }
    });
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);
  }
};
/* Filipe */
/**
 * POST Apply Management Fee
 */
exports.postManagementFee = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    let management = await Management.findById(id).populate('parking');
    management = await Management.populate(management, { 
      path: 'parking.city',
      model: 'City'
    })

    if (!management)
      return next(boom.notFound("Management not found!"));

    var fee = 0;
    if (req.body.feeValue) {
      fee = parseInt(req.body.feeValue)
    } else {
      
      let date = new Date();
      let exitTimeExpected = Date.parse(management.exitTimeExpected);

      let valueDiff = date.getTime() - exitTimeExpected;
      if (valueDiff <= 0) {
        return next(boom.badRequest("Management in time!"));
      }

      var minutes = Math.floor(valueDiff / 60000);
      var seconds = ((valueDiff % 60000) / 1000).toFixed(0);
      
      if (seconds > 0)
        minutes++;
  
      fee = management.parking.city.fee * minutes;
    }

    let update = {
      "fee": fee
    }
    
    const updateManagement = await Management.findById(id).updateOne({ _id : id },{ $set : update });
    const result = await Management.findById(id);

    res.status(200).jsonp({
      data: {
        _id: result._id,
        car: {
          _id: result.car._id,
          registration: result.car.registration,
          type: result.car.type
        },
        user: {
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email
        },
        parking: {
          _id: result.parking._id,
          location: result.parking.location,
          type: result.parking.type
        },
        entryTime: result.entryTime,
        timeExpected: result.timeExpected,
        valueExpected: result.valueExpected,
        exitTimeExpected: result.exitTimeExpected,
        exitTime: result.exitTime,
        fee: result.fee,
        value: result.value
      }
    });
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);
  }
};

/**
 * POST Management checkout
 */
exports.postManagementCheckout = async (req, res, next) => {
  const id = req.params.id;
  
  try {
    let management = await Management.findById(id);
    if (!management)
      return next(boom.notFound("Management not found!"));

    let checkOut = new Date();
    checkOut = checkOut.toISOString();

    let update = {
      "exitTime": checkOut,
      "value" : management.valueExpected + management.fee
    }

    let userUpdated = await User.findById(management.user);

    const updateParking = await Parking.findById(management.parking).updateOne(
      { _id : management.parking }, { $set : { "taken": false } });
    const updateManagement = await Management.findById(id).updateOne({ _id : id },{ $set : update });
    
    await User.findById(management.car.user).updateOne(
      { _id : management.user }, { $set : { "balance": (userUpdated.balance - update.value) } });

    const result = await Management.findById(id).populate('car user parking');

    res.status(200).jsonp({
      data: {
        _id: result._id,
        car: {
          _id: result.car._id,
          registration: result.car.registration,
          type: result.car.type
        },
        user: {
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email
        },
        parking: {
          _id: result.parking._id,
          location: result.parking.location,
          type: result.parking.type
        },
        entryTime: result.entryTime,
        timeExpected: result.timeExpected,
        valueExpected: result.valueExpected,
        exitTimeExpected: result.exitTimeExpected,
        exitTime: result.exitTime,
        fee: result.fee,
        value: result.value
      }
    });
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
  }
};

/**
 * Get all that exceded time
 */
exports.getManagementExceededTime = async (req, res, next) => {
  try {

    let { filter, skip, limit, sort, projection } = aqp(req.query);
    limit = limit ? limit : GLOBAL_CONFIGS.defaultVariables.paginationLimit;
    skip = skip ? skip : 0;

    let date = new Date();
    date = date.toISOString();

    filter.exitTime = { $eq: null };
    filter.exitTimeExpected = { $lt: date };

    let result = await Management.find(filter).sort(sort).skip(skip).limit(limit).select(projection).populate('car user parking');
    let count = await Management.find(filter).countDocuments();

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
          car: {
            _id: item.car._id,
            registration: item.car.registration,
            type: item.car.type
          },
          user: {
            _id: item.user._id,
            name: item.user.name,
            email: item.user.email
          },
          parking: {
            _id: item.parking._id,
            location: item.parking.location,
            type: item.parking.type
          },
          entryTime: item.entryTime,
          timeExpected: item.timeExpected,
          valueExpected: item.valueExpected,
          exitTimeExpected: item.exitTimeExpected,
          exitTime: item.exitTime,
          fee: item.fee,
          value: item.value
        }
      })
    }
    res.status(200).jsonp(response);

  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
  }
};
