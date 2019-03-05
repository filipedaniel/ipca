var express = require('express');
var router = express.Router();

// Required Controllers
const PublicationController = require('../controllers/publication');

// GET all Publications
router.get('/', PublicationController.getAllPublications);

// Get Publication
router.get('/:id', PublicationController.getPublication);


module.exports = router;