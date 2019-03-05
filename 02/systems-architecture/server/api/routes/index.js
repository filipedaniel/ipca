var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'AS - TP2 Parking Manager' });
});

module.exports = router;
