const mongoose = require('mongoose');
const aqp = require('api-query-params');
const boom = require('boom')

/**
 * Require modules
 */
const Parking = require('../models/parking');
const Management = require('../models/management');

/**
 * Require Global API Configs
 */
const GLOBAL_CONFIGS = require('../../app.config.js');


/**
 * GET all parking information
 * Ex: /parking?lat=41.406518&lng=-8.518748&maxDistance=10
 *     /limit=10&skip=10
 */
exports.getParkings = async (req, res, next) => {
  try {
    let { filter, skip, limit, sort, projection } = aqp(req.query);
    let maxDistance = 0;
    let lat = 0;
    let lng = 0;

    if (req.query.maxDistance) {
      maxDistance = req.query.maxDistance;
      if (req.query.lat == 0 && !req.query.lng == 0) {
        return next(boom.badRequest("Missing 'lat' and 'lng'!"));
      }
      if (req.query.lat == 0) {
        return next(boom.badRequest("Missing 'lat'!"));
      }
      if (req.query.lng == 0) {
        return next(boom.badRequest("Missing lng'!"));
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
    let pages = 1;
    
    let page = 1;
    if (maxDistance == 0) {
      result = await Parking.find(filter).sort(sort).skip(skip).limit(limit).select(projection).populate('city');
      count = await Parking.find(filter).countDocuments();

      pages = Math.ceil(count / limit);
      page = Math.ceil(skip / limit) + 1;
    } else {
      if (!sort) {
        sort = { "dist.calculated": 1  };
      }
      
      let geonear = {
        near : {
          type: "Point", 
          //coordinates: [41.536526, -8.6333554]
          //coordinates: [41.747747747747745, -8.69404839238829]
          coordinates: [Number(lat), Number(lng)]
        }, 
        maxDistance: parseFloat(maxDistance),
        distanceField: "dist.calculated",
        spherical :true
      }

      result = await Parking
        .aggregate([
          { $geoNear: geonear },
        {"$match" : filter},
        {"$sort": sort }]
        //{"$skip": skip },
        //{"$limit": limit }]
      )
      /*result = await Parking.find({
        "location.coordinates": { 
          $near:{ 
            $geometry :{
              type: "Point", 
              //coordinates: [41.536526, -8.6333554]
              coordinates: [parseFloat(lat), parseFloat(lng)]
            }, 
          $maxDistance: parseFloat(maxDistance)
          //$maxDistance: 380
        }
      }*/
      
      result = await Parking.populate(result, {path: "city"});

      count = result.length;
      limit = -1;
      skip = -1;
      page = 1;
      pages = 1;

      //count = await Parking.find(filter).countDocuments();
    }

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
          taken: item.taken,
          dist: item.dist
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

/**
 * GET parking information by :id
 */
exports.getParking = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { projection } = aqp(req.query);

    let result = await Parking.findById(id).select(projection).populate('city');
    
    if (!result) {
      return next(boom.notFound("Parking not found!"));
    }

    res.status(200).jsonp({
      data: {
        _id: result._id,
        city: result.city,
        location: {
          street: result.location.street,
          coordinates: result.location.coordinates,
        },
        type: result.type,
        taken: result.taken
      }
    })
  } catch (err) {
    if (!err.isBoom) {
      return next(boom.badImplementation(err.message));
    }
    next(err);
  }
};

/**
 * GET Parking status: taken and notTaken numbers
 */
exports.getParkingStatus = async (req, res, next) => {
  try {
    const count = await Parking.find().countDocuments();
    const normalTotal = await Parking.find({ 'type': 'Normal' }).countDocuments();
    const normalTotalTaken = await Parking.find({ 'type': 'Normal', 'taken' : true }).countDocuments();
  
    const specialTotal = await Parking.find({ 'type': 'Special' }).countDocuments();
    const specialTotalTaken = await Parking.find({ 'type': 'Special', 'taken' : true }).countDocuments();
    
    const transportTotal = await Parking.find({ 'type': 'Transport' }).countDocuments();
    const transportTotalTaken = await Parking.find({ 'type': 'Transport', 'taken' : true }).countDocuments();

    const electricTotal = await Parking.find({ 'type': 'Electric' }).countDocuments();
    const electricTotalTaken = await Parking.find({ 'type': 'Electric', 'taken' : true }).countDocuments();
    
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
          },
          electric: {
            total: electricTotal,
            taken: electricTotalTaken,
            notTaken: electricTotal - electricTotalTaken
          }
        }
      }
    }) 
  } catch (err) {
    if (!err.isBoom) {
      return next(boom.badImplementation(err.message));
    }
    next(err);
  }
};


