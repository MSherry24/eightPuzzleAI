var express = require('express');
var router = express.Router();
var driver = require('../controllers/puzzle/eightPuzzle');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/run', function(req, res) {
  var results = driver.run(req);
  res.json(JSON.stringify(results));
});

module.exports = router;
