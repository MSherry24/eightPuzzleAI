/**
 * Created by Mike on 1/10/2015.
 *
 */
var search = require('../algorithms/searchDriver');
var h1 = require('./misplacedTiles');
var h2 = require('./manhattanDistance');

/*
 *=======================================================================
 * getFirstZeroIndex()
 * Input: (String) - A JSON stringified version of a puzzle state
 * Output: (Number) - Depending on what field is set to zero, (the open spot
*                     on the puzzle board), a string representing that
*                     value's key is returned.
 *=======================================================================
 */
var getFirstZeroIndex = function (key) {
    "use strict";
    // This is called at the beginning of a puzzle analysis to determine which spot in the puzzle's
    // initial state is the open sqaure.  After this is determined, all future puzzle states will have
    // their zero index cached as a part of their node object that is stored in the solutionTree.
    var inputObject = JSON.parse(key);
    if (inputObject._1 === '0') { return '_1'; }
    if (inputObject._2 === '0') { return '_2'; }
    if (inputObject._3 === '0') { return '_3'; }
    if (inputObject._4 === '0') { return '_4'; }
    if (inputObject._5 === '0') { return '_5'; }
    if (inputObject._6 === '0') { return '_6'; }
    if (inputObject._7 === '0') { return '_7'; }
    if (inputObject._8 === '0') { return '_8'; }
    return '_9';
};

/*
 *=======================================================================
 * addToSolutionTree()
 * Input:
 * newNodeObject (object) -
 *      Fields {
 *          key (String): a JSON Stringified version of a puzzle state
 *          zeroIndex (String): The index where the open square is on the puzzle board
 *          whatChildIsThis (String): Either 'UP', 'DOWN', 'LEFT' or 'RIGHT' depending on
 *                                    which way the parent node's open spot shifted to get
 *                                    to this state
 *      }
 * currentKey (String) - a JSON Stringified version of a puzzle state
 * solutionTree (Object) - An object that is essentially a hash map where the key is a stringified representation of a puzzle state
 *                         and the value is an object containing all relevant data about that state (parent, children, heuristic scores, etc.)
 *                         (see the comments in addToSolutionTree about the structure of a node.)
 * evaluateHeuristic (Function) - A function that takes in a key an calculates a heuristic score.
 * Output: Object - The solution tree with the new node added in.
 *=======================================================================
 */
var addToSolutionTree = function (newNodeObject, currentKey, solutionTree, evaluateHeuristic) {
    "use strict";
    // This function takes a new node and adds it to a solutionTree object.  It appears in Eight Puzzle
    // driver because each puzzle will have its own node object representation.  The object added to the
    // solution tree below is also the prototype showing all of the fields that each node object will have
    var heuristicScore = 0;
    if (evaluateHeuristic !== '') {
        heuristicScore = evaluateHeuristic(newNodeObject.key);
    }
    solutionTree[newNodeObject.key] = {
        upChild: '',
        leftChild: '',
        downChild: '',
        rightChild: '',
        parent: currentKey,
        zeroIndex: newNodeObject.zeroIndex,
        whatChildIsThis: newNodeObject.whatChildIsThis,
        depth: solutionTree[currentKey].depth + 1,
        gnScore: solutionTree[currentKey].depth + 1, // g(n)
        hnScore: heuristicScore                      // h(n)
    };
    return solutionTree;
};

/*
 *=======================================================================
 * swap()
 * Input: currentKey (String) - A JSON stringified version of a puzzle state
 *        zeroIndex (String) - The index where the open square is on the puzzle board
 *        swapIndex (String) - The index of the square that is to be swapped with the open square
 *
 * Output: (Object) -
 *      key - A JSON stringified version of the new state
 *      zeroIndex - the index where the new state's open square is
 *=======================================================================
 */
var swap = function (currentKey, zeroIndex, swapIndex) {
    "use strict";
    // Used by getNextNodes() to generate a new puzzle state by swapping the open spot (represented by a "0")
    // with the provided swap index.
    var newNode, currentNode;
    //console.log('swap');
    newNode = JSON.parse(currentKey);
    currentNode = JSON.parse(currentKey);
    newNode[zeroIndex] = currentNode[swapIndex];
    newNode[swapIndex] = currentNode[zeroIndex];
    // The newly generated puzzle state and its zero index are returned
    return { key: JSON.stringify(newNode), zeroIndex: swapIndex };
};


/*
 *=======================================================================
 * successorFunction()
 * Input: currentKey (String) - A JSON stringified version of a puzzle state
 *      solutionTree (Object) - An object that is essentially a hash map where the key is a stringified
 *                              representation of a puzzle state and the value is an object containing
 *                              all relevant data about that state (parent, children, heuristic scores, etc.)
 *                              (see the comments in addToSolutionTree about the structure of a node.)
 *
 * Output: (Array) - An array containing all of the child nodes generated by the successor function.
 *=======================================================================
 */
var successorFunction = function (currentKey, solutionTree) {
    "use strict";
    // This function takes a puzzle state (or "Node") and its zero index as input.  Depending on
    // the zeroIndex, a certain number of child states are possible.  For example, if the zeroIndex is 1,
    // this corresponds to the open spot of the eight puzzle being in the top left square on the board.
    // There are only two future puzzle states, one if you move the tile below the zero index up, and one
    // if you slide the tile to the right of the zero index left.  In this case, the function calls swap()
    // with inputs of '_2' and '_4' and sets them to 'rightChild' and 'downChild' respectively.
    var upChild, downChild, rightChild, leftChild, nextNodes, zeroIndex;
    zeroIndex = solutionTree[currentKey].zeroIndex;
    upChild = { key: '', zeroIndex: '', whatChildIsThis: '' };
    leftChild = { key: '', zeroIndex: '', whatChildIsThis: '' };
    downChild = { key: '', zeroIndex: '', whatChildIsThis: '' };
    rightChild = { key: '', zeroIndex: '', whatChildIsThis: '' };
    if (zeroIndex === '_1') {
        rightChild = swap(currentKey, zeroIndex, '_2');
        downChild = swap(currentKey, zeroIndex, '_4');
    }
    if (zeroIndex === '_2') {
        leftChild = swap(currentKey, zeroIndex, '_1');
        rightChild = swap(currentKey, zeroIndex, '_3');
        downChild = swap(currentKey, zeroIndex, '_5');
    }
    if (zeroIndex === '_3') {
        leftChild = swap(currentKey, zeroIndex, '_2');
        downChild = swap(currentKey, zeroIndex, '_6');
    }
    if (zeroIndex === '_4') {
        upChild = swap(currentKey, zeroIndex, '_1');
        rightChild = swap(currentKey, zeroIndex, '_5');
        downChild = swap(currentKey, zeroIndex, '_7');
    }
    if (zeroIndex === '_5') {
        upChild = swap(currentKey, zeroIndex, '_2');
        leftChild = swap(currentKey, zeroIndex, '_4');
        rightChild = swap(currentKey, zeroIndex, '_6');
        downChild = swap(currentKey, zeroIndex, '_8');
    }
    if (zeroIndex === '_6') {
        upChild = swap(currentKey, zeroIndex, '_3');
        leftChild = swap(currentKey, zeroIndex, '_5');
        downChild = swap(currentKey, zeroIndex, '_9');
    }
    if (zeroIndex === '_7') {
        upChild = swap(currentKey, zeroIndex, '_4');
        rightChild = swap(currentKey, zeroIndex, '_8');
    }
    if (zeroIndex === '_8') {
        upChild = swap(currentKey, zeroIndex, '_5');
        leftChild = swap(currentKey, zeroIndex, '_7');
        rightChild = swap(currentKey, zeroIndex, '_9');
    }
    if (zeroIndex === '_9') {
        upChild = swap(currentKey, zeroIndex, '_6');
        leftChild = swap(currentKey, zeroIndex, '_8');
    }
    // The objects themselves are stored in the NextNodes array and returned to the calling function.
    nextNodes = [];
    upChild.whatChildIsThis = 'UP';
    leftChild.whatChildIsThis = 'LEFT';
    downChild.whatChildIsThis = 'DOWN';
    rightChild.whatChildIsThis = 'RIGHT';
    nextNodes.push(upChild);
    nextNodes.push(leftChild);
    nextNodes.push(downChild);
    nextNodes.push(rightChild);
    //console.log('end successorFunction');
    return nextNodes;
};

/*
 *=======================================================================
 * run()
 * Input: puzzleInfo (Object) -
 *      Fields {
 *          input (String): Passed in by the UI, a stringified JSON object representing a single puzzle state
 *          goal (String: Passed in by the UI, a stringified JSON object representing the goal state
 *      }
 * Output: (Object) - The solution tree in its final state and any error messages generated.
 *=======================================================================
 */
exports.run = function (puzzleInfo) {
    "use strict";
    var results, puzzleFunctions, heuristicScore, heuristic;
    heuristicScore = 0;
    // Figure out if a heuristic funciton is needed and if so, which one.
    if (puzzleInfo.algorithm === 'Greedy' || puzzleInfo.algorithm === 'A* Manhattan') {
        heuristicScore = h2.evaluate(puzzleInfo.input);
        heuristic = h2;
    } else if (puzzleInfo.algorithm === 'A* Tiles') {
        heuristicScore = h1.evaluate(puzzleInfo.input);
        heuristic = h1;
    } else {
        heuristicScore = '';
        heuristic = { evaluate: '' };
    }
    // add successor function, addToSolutionTree and evaluateHeuristic to a single object
    // for use in searchDriver.
    puzzleFunctions = {
        addToSolutionTree: addToSolutionTree,
        successorFunction: successorFunction,
        evaluateHeuristic: heuristic.evaluate
    };
    // Create root node
    puzzleInfo.rootNode = {
        upChild: '',
        leftChild: '',
        downChild: '',
        rightChild: '',
        parent: 'root',
        zeroIndex: getFirstZeroIndex(puzzleInfo.input),
        whatChildIsThis: 'start',
        depth: 0,
        hnScore: heuristicScore,
        gnScore: 0
    };
    results = search.run(puzzleInfo, puzzleFunctions);
    return results;
};