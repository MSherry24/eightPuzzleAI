/**
 * Created by Mike on 1/10/2015.
 *
 * This file, for the moment, serves as the main function that is called from the UI.  Clicking
 * the "Solve Puzzle" button makes an http POST call to the node server, which is turn passes the
 * body of the post to eightPuzzle.run()
 *
 */
var search = require('../algorithms/genericSearch');

exports.run = function (req) {
    "use strict";
    var input, algorithm, inputObject, goal,
        easyInput, mediumInput, hardInput, results;
    // Determine the input and algorithm type chosen by the user
    input = req.body.input;
    algorithm = req.body.algorithm;
    // Hard code in the easy, medium and hard inputs as well as the final state.
    goal = {_1: '1', _2: '2', _3: '3', _4: '8', _5: '0', _6: '4', _7: '7', _8: '6', _9: '5'};
    easyInput = {_1: '1', _2: '3', _3: '4', _4: '8', _5: '6', _6: '2', _7: '7', _8: '0', _9: '5'};
    mediumInput = {_1: '2', _2: '8', _3: '1', _4: '0', _5: '4', _6: '3', _7: '7', _8: '6', _9: '5'};
    hardInput = {_1: '5', _2: '6', _3: '7', _4: '4', _5: '0', _6: '8', _7: '3', _8: '2', _9: '1'};

    // Based on the user input, pass the easy, medium, hard, or custom input to the generic search run() method
    if (input === "Easy") {
        inputObject = easyInput;
    } else if (input === "Medium") {
        inputObject = mediumInput;
    } else if (input === "Hard") {
        inputObject = hardInput;
    } else {
        inputObject = JSON.parse(req.body.customInput);
    }
    results = search.run(inputObject, goal, algorithm);

    // Add the user's input and algorithm choice to the results object so that it can be
    // displayed back to the user along with the puzzle results
    results.info.input = input;
    results.info.algorithm = algorithm;
    return results;
};

