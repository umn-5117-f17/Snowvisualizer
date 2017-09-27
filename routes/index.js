var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Winter Is Coming...' });
});

router.get('/map', function(req, res, next) {
  res.render('googlemap', { title: 'Express' });
});

module.exports = router;
