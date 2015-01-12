/**
 * Created by Mike on 1/10/2015.
 */
//var puzzle = require('../genericPuzzle');
var breadth = require('../algorithms/breadthFirst')

exports.run = function (req) {
    "use strict";
    var input, algorithm, inputObject, goal,
      easyInput, mediumInput, hardInput;
    input = req.body.input;
    algorithm = req.body.algorithm;
    goal = {_1: '1', _2: '2', _3: '3', _4: '8', _5: '0', _6: '4', _7: '7', _8: '6', _9: '5'};
    easyInput = {_1: '1', _2: '3', _3: '4', _4: '8', _5: '6', _6: '2', _7: '7', _8: '0', _9: '5'};
    mediumInput = {_1: '2', _2: '8', _3: '1', _4: '0', _5: '4', _6: '3', _7: '7', _8: '6', _9: '5'};
    hardInput = {_1: '5', _2: '6', _3: '7', _4: '4', _5: '0', _6: '8', _7: '3', _8: '2', _9: '1'};

    if (input === "Easy") {
        inputObject = easyInput;
    } else if (input === "Medium") {
        inputObject = mediumInput;
    } else {
        inputObject = hardInput;
    }
    if (algorithm === "Breadth") {
        breadth.run(JSON.stringify(inputObject), JSON.stringify(goal));
    }
    console.log('input = ' + JSON.stringify(inputObject));
    return 'hi';
}