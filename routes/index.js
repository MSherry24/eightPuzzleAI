var express = require('express');
var router = express.Router();
var driver = require('../controllers/puzzle/genericPuzzle');

/* GET home page. */
router.get('/', function(req, res) {
  // Render the main app page (index.jade)
  res.render('index', { title: 'Express' });
});

router.post('/run', function(req, res) {
  // Called when the user clicks the "Solve Puzzle" button
  var results = driver.run(req);
  res.json(JSON.stringify(results));
});

module.exports = router;
