const mongoose = require('mongoose');
const aqp = require('api-query-params');
const boom = require('boom')

/**
 * Require modules
 */
const City = require('../models/city');
const Parking = require('../models/parking');
const Management = require('../models/management');
const Car = require('../models/car');
const User = require('../models/user');

/**
 * Require Global API Configs
 */
const GLOBAL_CONFIGS = require('../../app.config.js');

/**
 * GET all cities
 */
exports.getCities = async (req, res, next) => {
  try {
    let { filter, skip, limit, sort, projection } = aqp(req.query);
    limit = limit ? limit : GLOBAL_CONFIGS.defaultVariables.paginationLimit;
    
    skip = skip ? skip : 0;

    let result = await City.find(filter).sort(sort).skip(skip).limit(limit).select(projection);
    let count = await City.find(filter).countDocuments();
    
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
          description: item.description,
          price: item.price,
          fee: item.fee
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
 * POST new Paiking
 */
exports.postCity = async (req, res, next) => {

  try {
    const description = req.body.description;
    const price = req.body.price;
    const fee = req.body.fee;

    const newCity = new City({
      _id: new mongoose.Types.ObjectId(),
      description: description,
      price: price,
      fee: fee
    });

    const result = await newCity.save();
    
    res.status(201).jsonp({
      data: {
        _id: result._id,
        description: result.description,
        price: result.price,
        fee: result.fee
      }
    })

  } catch (err) {
    if (!err.isBoom) 
      return next(boom.badImplementation(err.message));
    next(err);
  }
};

/**
 * GET city information by :id
 */
exports.getCity = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { projection } = aqp(req.query);
    const result = await City.findById(id).select(projection);

    if (!result)
      return next(boom.notFound("City not found!"));

    res.status(200).jsonp({
      data: {
        _id: result._id,
        description: result.description,
        price: result.price,
        fee: result.fee
      }
    });
  } catch (err) {
    if (!err.isBoom) 
      return next(boom.badImplementation(err.message));
    next(err); 
  }
};

/**
 * PATCH city by id
 */
exports.patchCity = async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    
    //console.log(">> missing data validation!");

    const result =  await City.findById(id);
    if (!result)
      return next(boom.notFound("City not Found!"));

    const updateCity = await City.findById(id).updateOne({ _id : id },{ $set : body });
    let updatedCity = await City.findById(id);
    
    res.status(200).jsonp({ 
      data: {
        _id: updatedCity._id,
        description: updatedCity.description,
        price: updatedCity.price,
        fee: updatedCity.fee
      }
    });
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);
  }
};

/**
 * GET city parkings
 */
exports.getCityParkings = async (req, res, next) => {
  try {

    let id = req.params.id;
    let { filter, skip, limit, sort, projection } = aqp(req.query);
    let maxDistance = '';
    let lat = '';
    let lng = '';

    if (req.query.maxDistance) {
      maxDistance = req.query.maxDistance;
      if (!req.query.lat && !req.query.lng ) {
        return next(boom.badRequest("Missing 'lat' and 'lng'!"));
      }
      if (!req.query.lat) {
        return next(boom.badRequest("Missing 'lat'!"));
      }
      if (!req.query.lng ) {
        return next(boom.badRequest("Missing 'lng'!"));
      }

      lat = req.query.lat;
      lng = req.query.lng;
      delete filter.maxDistance;
      delete filter.lat;
      delete filter.lng;
    }
    delete filter.city;

    limit = limit ? limit : GLOBAL_CONFIGS.defaultVariables.paginationLimit;
    skip = skip ? skip : 0;
  
    let result;
    let count;

    if (maxDistance == '') {
      result = await Parking.find( { 'city' : id } ).find(filter).sort(sort).skip(skip).limit(limit).select(projection).populate('city');
      count = await Parking.find( { 'city' : id } ).find(filter).countDocuments();
    } else {
      let nearQuery = {
        $near: [ parseInt(lat), parseInt(lng) ],
        $maxDistance: parseInt(maxDistance)  
      };

      result = await Parking
        .find( { 'city' : id } )
        .find({'location.coordinates': nearQuery})
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .populate('city');
        
      count = await Parking.find( { 'city' : id } ).find({'location.coordinates': nearQuery}).find(filter).count();
    }

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
          city: item.city,
          location: {
            street: item.location.street,
            coordinates: item.location.coordinates,
          },
          type: item.type,
          taken: item.taken
        }
      })
    }
    res.status(200).jsonp(response);

  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);  
  }
};

/**
 * POST new Paoking
 */
exports.postCityParking = async (req, res, next) => {
  try {
    const idCity = req.params.id;
    const resultCity = await City.findById(idCity);
    
    if (!resultCity) {
      return next(boom.notFound("City not found!"));
    }

    const street = req.body.street;
    const coordinates = req.body.coordinates;
    const type = req.body.type;
    const taken = req.body.taken;

    
    const newParking = new Parking({
      _id: new mongoose.Types.ObjectId(),
      city: idCity,
      location: {
        street: street,
        coordinates: {
          coordinates: coordinates
        }
      },
      type: type,
      taken: taken
    });

    const result = await newParking.save();

    res.status(201).jsonp({
      data: {
        _id: newParking._id,
        city: newParking.city,
        location: newParking.location,
        type: newParking.type,
        taken: newParking.taken
      }
    })

  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);  
  }
};

/**
 * GET City parking
 */
exports.getCityParking = async (req, res, next) => {
  try {
    const idCity = req.params.id;
    const idParking = req.params.idParking;
  
    let { projection } = aqp(req.query);

    let result = await Parking.findById(idParking).select(projection).populate('city');
    
    if (!result || result.city._id != idCity) {
      return next(boom.notFound("Parking not found!"));
    }
    res.status(200).jsonp({
      data: {
        _id: result._id,
        city: result.city,
        location: result.location,
        type: result.type,
        taken: result.taken
      }
    })
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);  
  }
};

/**
 * PATCH City parking by id
 */
exports.patchCityParking = async (req, res, next) => {
  try {
    const idCity = req.params.id;
    const idParking = req.params.idParking;

    // remove city - not allow
    const body = req.body;
    if (body.city)
      delete body.city;

    //console.log(">> missing data validation!");

    let result = await Parking.findById(idParking);
    let updateBody = {
      location: {
        street: req.body.street ? req.body.street : result.location.street,
        coordinates: req.body.coordinates ? req.body.coordinates : result.location.coordinates
      },
      type: req.body.type ? req.body.type : result.type
    }

    if (!result || result.city._id != idCity) {
      return next(boom.notFound("Parking not found!"));
    }

    const updateParking = await Parking.findById(idParking).updateOne({ _id : idParking },{ $set : updateBody });

    let parking = await Parking.findById(idParking);
    res.status(200).jsonp({ 
      data: {
        _id: parking._id,
        city: parking.city,
        location: parking.location,
        type: parking.type,
        taken: parking.taken
      }
    });
    
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err); 
  }
};

/**
 * DELETE parking by id
 */
exports.deleteCityParking = async (req, res, next) => {
  try {
    const idCity = req.params.id;
    const idParking = req.params.idParking;
    
    let result = await Parking.findById(idParking);
    
    if (!result || result.city != idCity) {
      return next(boom.notFound("Parking not found!"));
    }

    let deleteParking = await Parking.remove({ _id: idParking });
    
    res.status(200).jsonp({
      data: {
        message: 'Parking deleted!'
      }
    })
    
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err); 
  }
};

/**
 * Get City Parking status
 */
exports.getCityParkingStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
  
    const count = await Parking.find( { 'city' : id } ).countDocuments();

    const normalTotal = await Parking.find({ 'city' : id, 'type': 'Normal' }).countDocuments();
    const normalTotalTaken = await Parking.find({ 'city' : id, 'type': 'Normal', 'taken' : true }).countDocuments();
  
    const specialTotal = await Parking.find({ 'city' : id, 'type': 'Special' }).countDocuments();
    const specialTotalTaken = await Parking.find({ 'city' : id, 'type': 'Special', 'taken' : true }).countDocuments();
    
    const transportTotal = await Parking.find({ 'city' : id, 'type': 'Transport' }).countDocuments();
    const transportTotalTaken = await Parking.find({ 'city' : id, 'type': 'Transport', 'taken' : true }).countDocuments();
    
    const takenParking = normalTotalTaken + specialTotalTaken + transportTotalTaken;

    res.status(200).jsonp({
      data: {
        total: count,
        taken: takenParking,
        notTaken: count - takenParking,
        types: {
          normal: {
            total: normalTotal,
            taken: normalTotalTaken,
            notTaken: normalTotal - normalTotalTaken
          },
          special: {
            total: specialTotal,
            taken: specialTotalTaken,
            notTaken: specialTotal - specialTotalTaken
          },
          transport: {
            total: transportTotal,
            taken: transportTotalTaken,
            notTaken: transportTotal - transportTotalTaken
          }
        }
      }
    })
  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err); 
  }
};

/**
 * POST Reserve parking by id
 */
exports.postParkingReserve = async (req, res, next) => {
  try {
    //const idCity = req.params.id;
    const idParking = req.params.id;
    const userId = req.userData.userId;
    
    let idCar = req.body.car;
    let timeExpected = req.body.timeExpected;

    if (!idCar)
      return next(boom.badRequest("Car missing!"));
    if (!timeExpected)
      return next(boom.badRequest("Expected time missing!"));

    let date = new Date();

    let timeExpectedMs = parseInt(timeExpected) * 60000;
    let startDate = date.toISOString();
    let endExpected = (new Date(date.getTime() + timeExpectedMs)).toISOString();

    let user = await User.findById(userId);
    if (user.balance <= 0)
      return next(boom.badRequest("User balance lower or equal then 0!"));

    let parking = await Parking.findById(idParking).populate('city');
    let car = await Car.findById(idCar);

    if (!parking)
      return next(boom.notFound("Parking not found!"));
    
    if (!car || car.user._id != userId)
        return next(boom.notFound("Car not found!"));
    
    if (parking.type == "Electric" && car.type != "Electric") {
      return next(boom.badRequest("Parking Electric type not authorized!"));
    }
    if (parking.type == "Special" && car.type != "Special") {
      return next(boom.badRequest("Parking Special type not authorized!"));
    } 
    if (parking.type == "Transport" && car.type != "Transport") {
      return next(boom.badRequest("Parking Transport type not authorized!"));
    } 
    
    if (parking.taken)
      return next(boom.methodNotAllowed("Parking already taken!"));

    const updateParking = await Parking.findById(idParking).updateOne({ _id : idParking },{ $set : { taken: true } });

    const management = new Management({
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      car: idCar,
      parking: idParking,
      entryTime: startDate,
      timeExpected: timeExpected,
      valueExpected: parking.city.price * timeExpected,
      exitTimeExpected: endExpected
    });

    await management.save();

    const man = await Management.findById(management._id);
    
    res.status(200).jsonp({ 
      data: {
        _id: man._id,
        user: man.user,
        car: man.car,
        parking: man.parking,
        entryTime: man.entryTime,
        timeExpected: man.timeExpected,
        valueExpected: man.valueExpected,
        exitTimeExpected: man.exitTimeExpected
      }
    });

  } catch (err) {
    if (!err.isBoom)
      return next(boom.badImplementation(err.message));
    next(err);
  }
};
