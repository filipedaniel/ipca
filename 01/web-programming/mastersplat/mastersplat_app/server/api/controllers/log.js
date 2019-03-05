const mongoose = require('mongoose');
const aqp = require('api-query-params');

var errCodes = require('../codes/log-codes.json');


const GLOBAL_VARIABLES = {
  paginationLimit: 10
}

// Require App Models
const Log = require('../models/log');

// Get all Logs Metadata
exports.getAllLogs = (req, res, next) => {
  let search = req.query.search ? req.query.search : '';
  let { filter, skip, limit, sort, projection } = aqp(req.query);
  
  if (search != '') delete filter.search;

  limit = limit ? limit : GLOBAL_VARIABLES.paginationLimit;
  skip = skip ? skip : 0;

  if (search != "") {
    Log
      .find( { $text: { $search: search } } )
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection)
      .exec()
      .then(async result => {
        let count = await Log.find( { $text: { $search: search } } ).find(filter).count();
        
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
              _id : item._id,
              start_date : item.start_date,
              end_date : item.end_date,
              total_records : item.total_records,
              data_provider : item.data_provider
            }
          })
        }
        res.status(200).jsonp(response);  
      })
      .catch(err => {
        res.status(500).jsonp({
          error: {
            code: '1.003.0001',
            message: err.message ? err.message : errCodes["10030001"]
          }
        })
  
      })
  } else {
    Log
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection)
      .exec()
      .then(async result => {
        let count = await Log.find(filter).count();
        
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
              _id : item._id,
              start_date : item.start_date,
              end_date : item.end_date,
              total_records : item.total_records,
              data_provider : item.data_provider
            }
          })
        }
        res.status(200).jsonp(response);  
      })
      .catch(err => {
        res.status(500).jsonp({
          error: {
            code: '1.003.0001',
            message: err.message ? err.message : errCodes["10030001"]
          }
        })
  
      })
  }
}

// Get Log
exports.getLog = (req, res, next) => {
  let { projection } = aqp(req.query);

  Log
    .findById(req.params.id)
    .select(projection)
    .exec()
    .then(result => {
      if (!result) {
        return res.status(404).jsonp({
          error: {
            code: '3.003.0001',
            message: errCodes["30030001"]
          }
        })
      }

      res.status(200).jsonp({
        data: {
          _id: result._id,
          start_date: result.start_date,
          end_date: result.end_date,
          total_records: result.total_records,
          data_provider: result.data_provider
        }
      })
    })
    .catch(err => {
      if (err.name == 'CastError') {
        res.status(400).jsonp({
          error: {
            code: '2.003.0001',
            message: err.message ? err.message : errCodes['20030001']
          }
        })
      } else {
        res.status(500).jsonp({
          error: {
            code: '1.003.0002',
            message: err.message ? err.message : errCodes['10030002'],
          }
        })
      }
    })

}


