const mongoose = require('mongoose');
const aqp = require('api-query-params');
const Common = require('../common/common');

/* Oaipmh vendor module */
const oaipmh = require('../vendor/oai-pmh-harvester/my_modules/oai-pmh-harvester/oai-pmh-harvester.js');

//Require App Models
const DataProvider = require('../models/dataProvider');
const Publication = require('../models/publication');
const Log = require('../models/log');

var errCodes = require('../codes/dataProvider-codes.json');

const GLOBAL_CONFIGS = require('../../app.config.js');



// Get all data providers
exports.getAllDataProviders = (req, res, next) => {
  let search = req.query.search ? req.query.search : '';
  let { filter, skip, limit, sort, projection } = aqp(req.query);
  
  if (search != '') delete filter.search;

  limit = limit ? limit : GLOBAL_CONFIGS.default_variables.paginationLimit;
  skip = skip ? skip : 0;
  
  if (search != "") {
    DataProvider
      .find( { $text: { $search: search } } )
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection)
      .exec()
      .then(async result => {
  
        let count = await DataProvider.find( { $text: { $search: search } } ).find(filter).count();
  
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
              name: item.name,
              url: item.url,
              total: item.total,
              inserted_date: item.inserted_date,
              updated_date: item.updated_date,
              status: item.status
            }
          })
        }
        res.status(200).jsonp(response);
      })    
      .catch(err => {
        res.status(500).jsonp({
          error: {
            code: '1.001.0001',
            message:  err.message ? err.message : errCodes['10010001']
          }
        })
      })  
  } else {
    DataProvider
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection)
      .exec()
      .then(async result => {
  
        let count = await DataProvider.find(filter).count();
  
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
              name: item.name,
              url: item.url,
              total: item.total,
              inserted_date: item.inserted_date,
              updated_date: item.updated_date,
              status: item.status
            }
          })
        }
        res.status(200).jsonp(response);
      })    
      .catch(err => {
        res.status(500).jsonp({
          error: {
            code: '1.001.0001',
            message:  err.message ? err.message : errCodes['10010001']
          }
        })
      })
  }
}


// Post a new Data Provider (url on the body), and load all masterthies
exports.postDataProvider = (req, res, next) => {
  const url = req.body.url;
  const name = req.body.name;
  
  if (!url) {
    return res.status(400).jsonp({
      error: {
        code: '2.001.0001',
        message: errCodes['20010001']
      }
    });
  }
  
  if (!Common.validateUrl(url)) {
    return res.status(400).jsonp({
      error : {
        code: '2.001.0002',
        message: errCodes['20010002']
      }
    });
  }

  if (!name) {
    return res.status(400).jsonp({
      error: {
        code: '2.001.0003',
        message: errCodes['20010003']
      }
    });
  }
    
  
  DataProvider.find( { "url" : req.body.url } )
    .exec()
    .then(async resultFind => {
      
      if (resultFind.length > 0) {
        return res.status(409).jsonp({
          error: {
            code: '3.001.0001',
            message: errCodes['30010001'],
            data: {
              _id: resultFind[0]._id,
              name: resultFind[0].name,
              url: resultFind[0].url,
              total: resultFind[0].total,
              inserted_date: resultFind[0].inserted_date,
              updated_date: resultFind[0].updated_date,
              status: resultFind[0].status
            }
          }
        });
      }
        
      const dataProvider = new DataProvider({
        _id: mongoose.Types.ObjectId(),
        name: name,
        url: url
      });

      let saveDataProvider = await dataProvider.save();

      res.status(201).jsonp({
        message: 'Insert Data Provider successfully!',
        data: {
          _id: saveDataProvider._id,
          name: saveDataProvider.name,
          url: saveDataProvider.url,
          inserted_date: saveDataProvider.inserted_date
        }
      })
    })
    .catch(err => {
      res.status(500).jsonp({
        error: {
          code: '1.001.0002',
          message: err.message ? err.message : errCodes['10010002']
        }
      })
    })
};


// Get info about data provider info (:id)
exports.getDataProvider = (req, res, next) => {
  let { projection } = aqp(req.query);

  DataProvider
    .findById(req.params.id)
    .select(projection)
    .exec()
    .then(result => {
      
      if (!result) {
        return res.status(404).jsonp({
          error: {
            code: '3.001.0002',
            message: errCodes['30010002']
          }
        })
      }
      
      res.status(200).jsonp({
        data: {
          _id: result._id,
          name: result.name,
          url: result.url,
          total: result.total,
          inserted_date: result.inserted_date,
          updated_date: result.updated_date,
          status: result.status
        }

      })
    })
    .catch(err => {
      if (err.name == 'CastError') {
        res.status(400).jsonp({
          error: {
            code: '2.001.0004',
            message: err.message ? err.message : errCodes['20010004']
          }
        })
      } else {
        res.status(500).jsonp({
          error: {
            code: '1.001.0003',
            message: err.message ? err.message : errCodes['10010003'],
          }
        })
      }
    });
};


// Delete Data Provider (:id)
exports.deleteDataProvider = (req, res, next) => {
  let id = req.params.id;
  
  DataProvider
    .findById(id)
    .exec()
    .then(async result => {

      if (!result) {
        return res.status(404).jsonp({
          error: {
            code: '3.001.0002',
            message: errCodes['30010002']
          }
        })
      }
      
      let deletePublication = await Publication.deleteMany({ 'data_provider.id' : id });
      let deleteDataProvider = await DataProvider.remove({ _id: id });

      res.status(200).jsonp({
        message: 'Data Provider and publications deleted!'
      })

    })
    .catch(err => {
      if (err.name == 'CastError') {
        res.status(400).jsonp({
          error: {
            code: '2.001.0004',
            message: err.message ? err.message : errCodes['20010004'],
          }
        })
      } else {
        res.status(500).jsonp({
          error: {
            code: '1.001.0004',
            message: err.message ? err.message : errCodes['10010004']
          }
        })
      }
    })
};


// Patch Data Provider
exports.patchDataProvider = (req, res, next) => {
  const id = req.params.id;
  
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.property_name] = ops.value;
  }

  if (updateOps.url) {
    if (!Common.validateUrl(updateOps.url)) {
      return res.status(400).jsonp({
        error : {
          code: '2.001.0002',
          message: errCodes['20010002']
        }
      });
    }
  }


  DataProvider
  .findById(id)
  .exec()
  .then(async result => {

    if (!result) {
      return res.status(404).jsonp({
        error: {
          code: '3.001.0002',
          message: errCodes['30010002']
        }
      })
    }

    let updateDataProvider = await DataProvider
      .findById(id)
      .update({ _id : id },{ $set : updateOps });
    
    let dataProvider = await DataProvider.findById(id);
    res.status(200).jsonp({ 
      //message: 'Data Provider Updated!',
      data: {
        _id: dataProvider._id,
        name: dataProvider.name,
        url: dataProvider.url,
        total: dataProvider.total,
        inserted_date: dataProvider.inserted_date,
        updated_date: dataProvider.updated_date,
        status: dataProvider.status
      }
    });
  })
  .catch(err => {
    if (err.name == 'CastError') {
      res.status(400).jsonp({
        error: {
          code: '2.001.0004',
          message: err.message ? err.message : errCodes['20010004'],
        }
      })
    } else {
      res.status(500).jsonp({
        error: {
          code: '1.001.0003',
          message: err.message ? err.message : errCodes['10010003']
        }
      })
    }
  })
}

// Load Data Provider Publications (:id)
exports.harvestDataProvider = (req, res, next) => {
  const id = req.params.id;

  DataProvider.findById(id)
  .exec()
  .then(async result => {
    
    if (!result) {
      return res.status(404).jsonp({
        error: {
          code: '3.001.0002',
          message: errCodes['30010002']
        }
      })
    }
    if (!result.updated_date) {
      insertDataProviderThesis(id, result.url);
    } else {
      if (GLOBAL_CONFIGS.options.update_from_date) {
        //let fromQuery = "2016-05-18T21:26:44.812Z";
        let fromQuery = (result.updated_date).toISOString();
        let untilQuery =new Date().toISOString();
        insertDataProviderThesis(id, result.url, fromQuery, untilQuery);
      } else {
        await Publication.deleteMany({ 'data_provider.id' : id });
        await DataProvider.update({ _id: id }, { $set: { total: 0 }});
        insertDataProviderThesis(id, result.url);
      }
    }
    res.status(200).jsonp({
      message: 'Harvest Data Providers!',
      data_provider: {
        _id: result._id,
        name: result.name,
        url: result.url,
        inserted_date: result.inserted_date,
        updated_date: result.updated_date
      }
    })
  })
  .catch(err => {
    res.status(500).jsonp({
      error: {
        code: '1.001.0005',
        message: err.message ? err.message : errCodes['10010005'],
      }
    })
  });
}

// Load Publications of all data providers
exports.harvestDataProviders = (req, res, next) => {

  DataProvider
    .find()
    .exec()
    .then(async result => {
      
      if (!result) {
        return res.status(404).jsonp({
          error: {
            code: '3.001.0002',
            message: errCodes['30010002']
          }
        })
      }
      
      
      let urlToHarvest = [];
      for (const i of result) {
        urlToHarvest.push(i); 
        if (!i.updated_date) {
          insertDataProviderThesis(i._id, i.url)
        } else {
          if (GLOBAL_CONFIGS.options.update_from_date) {
            //let fromQuery = "2016-05-18T21:26:44.812Z";
            let fromQuery = (i.updated_date).toISOString();
            let untilQuery = new Date().toISOString();
            insertDataProviderThesis(i._id, i.url, fromQuery, untilQuery);   
          } else {
            await Publication.deleteMany({ 'data_provider.id' : i._id });
            await DataProvider.update({ _id: i._id }, { $set: { total: 0 }});
            insertDataProviderThesis(i._id, i.url);
          }
        }
      }
      res.status(200).jsonp({
        message: 'Harvest all Data Providers!',
        data: urlToHarvest.map(item => {
          return {
            _id: item._id,
            name: item.name,
            url: item.url,
            inserted_date: item.inserted_date,
            updated_date: item.updated_date
          }
        })
      })
    })
    .catch(err => {
      res.status(500).jsonp({
        error: {
          code: '1.001.0007',
          message: err.message ? err.message : errCodes['10010007']
        }
      })
    });
}

// List all Publications from on data Provider (:id)
exports.getDataProviderPublications = (req, res, next) => {
  let id = req.params.id;
  let search = req.query.search ? req.query.search : '';
  
  let { filter, skip, limit, sort, projection } = aqp(req.query);
  
  if (search != '') delete filter.search;
  
  limit = limit ? limit : GLOBAL_CONFIGS.default_variables.paginationLimit;
  skip = skip ? skip : 0;

  Publication
    .find( { 'data_provider.id' : id } )
    .find( { $text: { $search: search } } )
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(projection)
    .exec()
    .then(async result => {
      if (!result) {
        return res.status(404).jsonp({
          error: {
            code: '3.001.0007',
            message: errCodes['30010007']
          }
        })
      }

      let count = await Publication
                    .find( { 'data_provider.id' : id } )
                    .find( { $text: { $search: search } } )
                    .find(filter)
                    .count();

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
            identifier: item.identifier,
            datestamp: item.datestamp,
            metadata: item.metadata
          }
        })
      }
      res.status(200).jsonp(response);
    })
    .catch(err => {
      res.status(500).jsonp({
        error: {
          code: '1.001.0006',
          message: err.message ? err.message : errCodes['10010006']
        }
      })
    })
}


// Insert the publication, from url using  OaiPmh. Returns a promise
async function insertDataProviderThesis(dataProviderId, url, fromQuery, untilQuery) {
  
  let harvester = new oaipmh.Harvester(url,fromQuery,untilQuery);

  let counterMasterThesis = 0;
  
  try {
    let dataProvider = await DataProvider.findById(dataProviderId);
    updateDataProvider = await DataProvider.update({ _id: dataProviderId }, { status: '1' });
    
    let newLog = new Log ({
      _id: mongoose.Types.ObjectId(),
      data_provider: {
        id: dataProvider._id,
        name: dataProvider.name,
        url: dataProvider.url
      },
      start_date: Date.now()
    });

    let recordCount = await harvester.harvest(
      async (item) => {
        try {
          if (item.header.$ && item.header.$.status == "deleted") return item;
            
          if ((item.metadata['oai_dc:dc']['dc:type']).includes("masterThesis")) {
            const addItemResult = await addPublicationItem(dataProvider, item);
            if (addItemResult == 0) {
              counterMasterThesis++;
            }
          }
          return item;
        } catch(err) {
          //console.debug(err);
        }
      });
    /*console.log('## ----------------------------------------------------------');
    console.log(`## URL => ${url} `);
    console.log(`## A total of ${recordCount} records have been harvested!`);
    console.log(`## A total of ${counterMasterThesis} master thesis`);
    console.log('## ----------------------------------------------------------');*/
    
    if (counterMasterThesis > 0) {
      newLog.end_date = Date.now();
      newLog.total_records = counterMasterThesis;
      
      let saveNewLog = await newLog.save();
      
      let data = await DataProvider.findById(dataProvider);

      
      let updateDataProvider = await DataProvider.update({ _id: dataProviderId }, { $inc: { total: counterMasterThesis }});
      updateDataProvider = await DataProvider.update({ _id: dataProviderId }, { $set: { updated_date: newLog.end_date }});
      updateDataProvider = await DataProvider.update({ _id: dataProviderId }, { status: '0' });
      
      return 0;
    }
    return 1;
  } catch(err) {
    let dataProvider = await DataProvider.findById(dataProviderId);
    updateDataProvider = await DataProvider.update({ _id: dataProviderId }, { status: '2' });
    let deletePublication = await Publication.deleteMany({ 'data_provider.id' : dataProviderId });
  }
}

// Format and Add Publication Item
function addPublicationItem(dataProvider, item) {
  return new Promise(async (resolve, reject) => {
    try {
      /*if ((typeof(item.metadata) !== 'undefined') && 
      typeof(item.metadata['oai_dc:dc']) !== 'undefined' && 
      typeof(item.metadata['oai_dc:dc']['dc:type']) !== 'undefined' && 
      (item.metadata['oai_dc:dc']['dc:type']).includes("masterThesis")) {*/
      let pubIdentifier = item.header['identifier'];
      let datestamp = item.header['datestamp'];
      let title = item.metadata['oai_dc:dc']['dc:title'];
      title = (typeof title == 'object' )?title.join("\n"):title;
      let type = item.metadata['oai_dc:dc']['dc:type'];
      let identifier = item.metadata['oai_dc:dc']['dc:identifier'];
      
      let master = {
        _id: mongoose.Types.ObjectId(),
        identifier: pubIdentifier,
        datestamp: datestamp
      }
      
      var masterMetadata = {
        title: title,
        identifier: identifier,
        type: type
      }
      
      if (item.metadata['oai_dc:dc']['dc:creator']) {
        masterMetadata["creator"] = item.metadata['oai_dc:dc']['dc:creator'];
      }
      
      if (item.metadata['oai_dc:dc']['dc:subject']) {
        masterMetadata["subject"] = item.metadata['oai_dc:dc']['dc:subject'];
      }
      
      if (item.metadata['oai_dc:dc']['dc:description']) {
        masterMetadata["description"] = item.metadata['oai_dc:dc']['dc:description'];
      }
      
      if (item.metadata['oai_dc:dc']['dc:date']) {
        masterMetadata["date"] = item.metadata['oai_dc:dc']['dc:date'];
      }
      
      if (item.metadata['oai_dc:dc']['dc:format']) {
        masterMetadata["format"] = item.metadata['oai_dc:dc']['dc:format'];
      }
      
      if (item.metadata['oai_dc:dc']['dc:contributor']) {
        masterMetadata["contributor"] = item.metadata['oai_dc:dc']['dc:contributor'];
      }
      
      if (item.metadata['oai_dc:dc']['dc:language']) {
        masterMetadata["lang"] = item.metadata['oai_dc:dc']['dc:language'];
      }
      
      if (item.metadata['oai_dc:dc']['dc:rights']) {
        masterMetadata["rights"] = item.metadata['oai_dc:dc']['dc:rights'];
      }
      
      if (item.metadata['oai_dc:dc']['dc:publisher']) {
        masterMetadata["publisher"] = item.metadata['oai_dc:dc']['dc:publisher'];
      }
      master["metadata"] = masterMetadata;
      master["data_provider"] = {
        id: dataProvider._id,
        name: dataProvider.name,
        url: dataProvider.url
      };
        
      let saveData = await new Publication(master).save();
      if (saveData) {
        resolve(0);
      } 
      resolve(1);
    } catch (err) {
      resolve(1);
    }
  })
}
