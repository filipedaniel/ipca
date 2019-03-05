const mongoose = require('mongoose');
const boom = require('boom');
const aqp = require('api-query-params');

let User = require('../models/user');
let Car = require('../models/car'); 
let Management = require('../models/management');

const GLOBAL_CONFIGS = require('../../app.config.js');

/**
 * Get all users
 */
exports.getUsers = (req, res, next) => {
  
  User.find((err, result) => {
    if (err) {
      return next(boom.badImplementation("There was an error geting all users"+ err));
    }
    res.status(200).jsonp({
      data: result.map(item => {
        return {
          _id: item._id,
          name: item.name,
          email: item.email,
          type: item.type,
          nif: item.nif,
          balance: item.balance
        }
      }) 
    })
  });
}

/**
 * Get user information
 */
exports.getUser = (req, res, next) => {
  User.findById(req.params.id, (err, result) => {
    if (err) 
      return next(boom.badImplementation("There was an error geting a user" + err));
    if (result == null) 
      return next(boom.notFound("User not found!"));

    res.status(200).jsonp({
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
        type: result.type,
        nif: result.nif,
        balance: result.balance
      }
    });
  });
}

/**
 * Update User
 */
exports.patchUser = async (req, res, next) => {
  delete req.body.password;
  delete req.body.email;

  let body = req.body;
  if (req.body.balance) {
    let user = await User.findById(req.params.id);
    body.balance = user.balance + body.balance;
  }
  
  User.findByIdAndUpdate(req.params.id, body , async (err, result) => {
    if (err) {
      return next(boom.badImplementation("There was an error updating the user" + err.message));
    }
    if (result == null) {
      return next(boom.notFound("User not found!"));
    }

    let updatedUser = await User.findById(req.params.id);
    res.status(200).jsonp({
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        type: updatedUser.type,
        nif: updatedUser.nif,
        balance: updatedUser.balance
      }
    });  
  });
}

/**
 * delete user
 */
exports.deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.id, (err, result) => {
  
    if (err) {
      return next(boom.badImplementation("There was an error delete a user" + err.message));
    }
    if (result == null) {
      return next(boom.notFound("The user dosent exist!"));
    } 
    // console.log("Missing: set false all managements regists");
    /**
     * Missing: set false all managements regists
     */
    res.status(200).jsonp({
      data: {
        message: "User deleted"
      }
    }
    );
  });
}


/***************************/

/**
 * Post User new car
 */
exports.postUserCar = async (req, res, next) => {
  try {
    const idUser = req.userData.userId;
    
    let user = await User.findById(idUser, { password: 0, balance : 0 });
    
    const carRegistration = req.body.registration;
    const carType = req.body.type;

    user.password = '-';
    delete user.balance;

    let car = new Car({
      _id: new mongoose.Types.ObjectId(),
      registration: carRegistration,
      type: carType ? carType : "Normal",
      user: user
    });

    const result = await car.save();

    res.status(201).jsonp({
      data: {
        _id: result._id,
        registration: result.registration,
        type: result.type
      }
    })

  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);
  }
}

/**
 * Get All card
 */
exports.getUserCars = async (req, res, next) => {
  try {
    const idUser = req.userData.userId;

    let result = await Car.find({ 'user._id' : idUser });
    
    res.status(200).jsonp({ 
      data: result.map(item => {
        return {
          _id: item._id,
          registration: item.registration,
          type: item.type
          //user: item.user
        }
      })
    });
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);
  }
}


/**
 * Patch car
 */
exports.patchUserCar = async (req, res, next) => {
  try {
    const idUser = req.userData.userId;
    const idCar = req.params.idCar;

    let body = {
      registration: req.body.registration,
      type: req.body.type
    }
  
    let result = await Car.findById(idCar);
    
    if (!result || result.user._id != idUser) {
      return next(boom.notFound("Car not found!"));
    }

    const updateCar = await Car.findById(idCar).updateOne({ _id : idCar },{ $set : body });

    let car = await Car.findById(idCar);
    
    res.status(200).jsonp({ 
      data: {
        _id: car._id,
        registration: car.registration,
        type: car.type
      }
    });
  } catch (err) {
    if (!err.isBoom) {
      return next(boom.badImplementation(err.message));
    }
    next(err);
  }
}

/**
 * Delete car
 */
exports.deleteUserCar = async (req, res, next) => {
  try {
    const idUser = req.userData.userId;
    const idCar = req.params.idCar;
    
    let result = await Car.findById(idCar);
    
    if (!result || result.user._id != idUser) {
      return next(boom.notFound("Car not found!"));
    }

    let deleteCar = await Car.remove({ _id: idCar });
    
    res.status(200).jsonp({
      data: {
        message: 'Car deleted!'
      }
    })
    
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err); 
  }
}


/**
 * GET all managements information
 */
exports.getUserManagement = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    let { filter, skip, limit, sort, projection } = aqp(req.query);
    limit = limit ? limit : GLOBAL_CONFIGS.defaultVariables.paginationLimit;
    skip = skip ? skip : 0;

    filter.user = userId;

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
    console.log(err);
    if (!err.isBoom) {
      return next(boom.badImplementation(err.message));
    }
    next(err);
  }


}