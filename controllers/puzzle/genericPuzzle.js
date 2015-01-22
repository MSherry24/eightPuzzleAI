/*
 * Generic Puzzle is the main driver for the puzzle solver.  It takes an input, a goal and a puzzle type from
 * the UI.  Depending on the input puzzle type, it will pass the input and the goal to the correct puzzle library.
 * Currently, the only puzzle supported is eightPuzzle.
 */

/*
 * genericPuzzle.run() takes an input object from the UI (req).  req is expected to be an object with the following
 * format: { puzzleType: string,
 *           algorithm: string,
 *           input: string,
 *           goal: string }
 *
 * run() parses out the puzzleType and then calls [puzzle].run() on the appropriate puzzle
 * passing in the input, goal and algorithm.
 *
 * The expected return object from a puzzle is in the following format:
 * res = {
 *          error: String - Any error messages
 *          solutionTree: object - a JS object representation of the tree generated by the puzzle after a solution is found
 *       }
 */
var eightPuzzle = require('./eightPuzzle');

exports.run = function (req) {
    var puzzleType, puzzle,
        puzzleInfo, puzzleOut,
        startTime, endTime,
        res;
    console.log('genericPuzzle.run');
    puzzle = '';
    res = {};
    puzzleInfo = {};
    puzzleType = req.body.puzzleType;
    puzzleInfo.algorithm = req.body.algorithm;
    puzzleInfo.input = req.body.input;
    puzzleInfo.goal = req.body.goal;

    if (puzzleType === 'eightPuzzle') {
        puzzle =  eightPuzzle;
    }
    if (puzzle === '') {
        res.error = 'invalid request';
    } else {
        startTime = new Date().getTime();
        puzzleOut = puzzle.run(puzzleInfo);
        endTime = new Date().getTime();
        res.runTime = (endTime - startTime) / 1000;
        if (puzzleOut.solutionTree === undefined) {
            res.error = 'No solution found';
            res.solutionPath = [];
        } else {
            res.error = "";
            res.solutionPath = getSolutionPath(puzzleInfo.goal, puzzleOut.solutionTree);
            res.nodesCreated = puzzleOut.nodesCreated;
            res.nodesVisited = puzzleOut.nodesVisited;
            res.queueMax = puzzleOut.queueMax;
        }
    }
    res.input = puzzleInfo.input;
    res.algorithm = puzzleInfo.algorithm;
    return res;
};

var getSolutionPath = function (goal, solutionTree) {
    "use strict";
    // getSolutionPath takes the final node of a puzzle solution and the tree generated by
    // the algorithm and traces back to the top most node in the tree.  Each step, it adds
    // the node it finds to an array and this array is eventually passed back to the UI so that the
    // user can step through a solution from beginning to end.
    var solutionPath, currentNode;
    solutionPath = [];
    currentNode = goal;
    solutionPath.push({node: goal, whatChild: solutionTree[goal].whatChildIsThis});
    while (solutionTree[currentNode].parent !== 'root') {
        currentNode = solutionTree[currentNode].parent;
        solutionPath.push({ node: currentNode, whatChild: solutionTree[currentNode].whatChildIsThis });
    }
    return solutionPath;
};