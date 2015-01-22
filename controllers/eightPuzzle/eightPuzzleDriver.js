/**
 * Created by Mike on 1/10/2015.
 *
 */
var search = require('../algorithms/searchDriver');
var h1 = require('./misplacedTiles');
var h2 = require('./manhattanDistance');

var getFirstZeroIndex = function (input) {
    "use strict";
    // This is called at the beginning of an algorithm to determine which spot in the puzzle
    // is the open spot.  After this is determined, all future puzzle states will have their zero index
    // cached as a part of their object that is stored in the solutionTree.
    //console.log('getFirstZeroIndex');
    //console.log('input = ' + input);
    var inputObject = JSON.parse(input);
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

var addToSolutionTree = function (newNodeObject, currentKey, solutionTree, evaluateHeuristic) {
    "use strict";
    // This function only takes a new node and adds it to a solutionTree object.  The only reason
    // this is broken out into its own function is because it is called by multiple algorithms.
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

exports.run = function (puzzleInfo) {
    "use strict";
    var results, puzzleFunctions, heuristicScore, heuristic;
    //console.log('eightPuzzle.run');
    // create root Node
    heuristicScore = 0;
    if (puzzleInfo.algorithm === 'Greedy' || puzzleInfo.algorithm === 'A* Manhattan') {
        heuristicScore = h2.evaluate(puzzleInfo.input);
        heuristic = h2;
    } else if (puzzleInfo.algorith === 'A* Tiles') {
        heuristicScore = h1.evaluate(puzzleInfo.input);
        heuristic = h1;
    } else {
        heuristicScore = '';
        heuristic = { evaluate: '' };
    }
    puzzleFunctions = {
        addToSolutionTree: addToSolutionTree,
        successorFunction: successorFunction,
        evaluateHeuristic: heuristic.evaluate
    };
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