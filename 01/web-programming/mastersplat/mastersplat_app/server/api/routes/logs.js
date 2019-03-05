var express = require('express');
var router = express.Router();

// Required Controllers
const LogController = require('../controllers/log');

// GET all Logs
router.get('/', LogController.getAllLogs);

// Get Log
router.get('/:id', LogController.getLog);


module.exports = router;