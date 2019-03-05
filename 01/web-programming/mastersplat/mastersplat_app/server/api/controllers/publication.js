const mongoose = require('mongoose');
const aqp = require('api-query-params');

var errCodes = require('../codes/publication-codes.json');

const GLOBAL_VARIABLES = {
  paginationLimit: 10
}
// Require App Models
const Publication = require('../models/publication');

// Get all Publications
exports.getAllPublications = (req, res, next) => {
  let search = req.query.search ? req.query.search : '';
  let { filter, skip, limit, sort, projection } = aqp(req.query);
  
  if (search != '') delete filter.search;
  
  limit = limit ? limit : GLOBAL_VARIABLES.paginationLimit;
  skip = skip ? skip : 0;
  
  if (search != "") {
    Publication
      .find( { $text: { $search: search } } )
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection)
      .exec()
      .then(async result => {
        let count = await Publication.find({$text: { $search: search } } ).find(filter).count();
        
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
              identifier: item.identifier,
              datestamp: item.datestamp,
              metadata: item.metadata,
              data_provider: item.data_provider
            }
          })
        }
        res.status(200).jsonp(response);  
      })
      .catch(err => {
        console.log(err);
        res.status(500).jsonp({
          error: {
            code: '1.002.0001',
            message:  err.message ? err.message : errCodes['10020001'],
          }
        })
      })
  } else {
    Publication
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection)
      .exec()
      .then(async result => {
        let count = await Publication.find(filter).count();
        
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
              identifier: item.identifier,
              datestamp: item.datestamp,
              metadata: item.metadata,
              data_provider: item.data_provider
            }
          })
        }
        res.status(200).jsonp(response);  
      })
      .catch(err => {
        console.log(err);
        res.status(500).jsonp({
          error: {
            code: '1.002.0001',
            message:  err.message ? err.message : errCodes['10020001'],
          }
        })
      })
  }
}

// Get Publication
exports.getPublication = (req, res, next) => {
  let { projection } = aqp(req.query);

  Publication
    .findById(req.params.id)
    .select(projection)
    .exec()
    .then(result => {
      
      if (!result) {
        return res.status(404).jsonp({
          error: {
            code: '3.002.0001',
            message: errCodes['30020001']
          }
        })
      }

      res.status(200).jsonp({
        data: {
          _id : result._id,
          identifier: result.identifier,
          datestamp: result.datestamp,
          metadata: result.metadata,
          data_provider: result.data_provider
        }
      })
    })
    .catch(err => {
      if (err.name == 'CastError') {
        res.status(400).jsonp({
          error: {
            code: '2.002.0001',
            message: err.message ? err.message : errCodes['20020001']
          }
        })
      } else {
        res.status(500).jsonp({
          error: {
            code: '1.002.0002',
            message: err.message ? err.message : errCodes['10020002'],
          }
        })
      }
    })

}


