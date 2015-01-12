var express = require('express');
var router = express.Router();
var driver = require('../puzzle/eightPuzzle');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/run', function(req, res) {
  console.log('hi');
  console.log('req = ' + req.body);
  console.log('req.body.name = ' + req.body.algorithm);

    var state1 = {_1:'1', _2:'2', _3:'3', _4:'4', _5:'5', _6:'6', _7:'7', _8:'8', _9:'_'},
        state2 = {_1:'1', _2:'2', _3:'3', _4:'4', _5:'5', _6:'6', _7:'7', _8:'_', _9:'8'},
        state3 = {_1:'1', _2:'2', _3:'3', _4:'4', _5:'5', _6:'6', _7:'_', _8:'7', _9:'8'},
        state4 = {_1:'1', _2:'2', _3:'3', _4:'_', _5:'5', _6:'6', _7:'4', _8:'7', _9:'8'},
    states, responseBlob;
  states = JSON.stringify([state1, state2, state3, state4]);
  responseBlob = {name: 'Mike', states: states};

  responseBlob.answer = driver.run(req);

  res.json(JSON.stringify(responseBlob));
});

module.exports = router;
