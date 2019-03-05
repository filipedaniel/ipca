var express = require('express');
var router = express.Router();


// Required Controllers
const DataProviderController = require('../controllers/dataProvider');


// GET All data providers
router.get('/', DataProviderController.getAllDataProviders);

// POST New data provider
router.post('/', DataProviderController.postDataProvider);

// GET Data Provider by {:id}
router.get('/:id', DataProviderController.getDataProvider);

// PATCH Data Provider by {:id}
router.patch('/:id', DataProviderController.patchDataProvider);

// DELETE Data Provider by {:id}
router.delete('/:id', DataProviderController.deleteDataProvider);

// Load publications from all data provider
router.post('/harvest', DataProviderController.harvestDataProviders);

// Load publications from one provider (:id)
router.post('/:id/harvest', DataProviderController.harvestDataProvider);

// Update all publications from provider
//router.patch('/harvest', DataProviderController.updateAllDataProviderPublications);

// Update publications from one provider (:id)
//router.patch('/:id/harvest', DataProviderController.updateDataProviderPublications);

// GET All publications from Data Provider {:id}
router.get('/:id/publications', DataProviderController.getDataProviderPublications);


module.exports = router;
