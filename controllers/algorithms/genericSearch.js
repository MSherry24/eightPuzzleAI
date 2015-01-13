/**
 * Created by Mike on 1/10/2015.
 *
 * Generic search contains common functions that are used by many or all of the serach algorithms.
 * genericSearch.run() is also the driver that selects the correct algorithm to use based on user input.  It is called
 * by puzzle/eightPuzzle.run()
 *
 */
var breadth = require('./breadthFirst');
var depth = require('./depthFirst');


exports.run = function(inputObject, goal, algorithm) {
    "use strict";
    // Initialize variables
    var results, runData;
    results = {};
    // "algorithm" is a string that represents the algorithm chosen by the user.  Depending on
    // which algorithm was chosen, this function will call the appropriate algorithm's run function
    // and provide it the input, and the goal state.
    if (algorithm === "Breadth") {
        runData = runAlgorithm(JSON.stringify(inputObject), JSON.stringify(goal), breadth);
        results.error = (results.info === 'no solution') ? { error: 'no solution found' } : '';
    }
    else if (algorithm === "Depth") {
        runData = runAlgorithm(JSON.stringify(inputObject), JSON.stringify(goal), depth);
        results.error = (results.info === 'no solution') ? { error: 'no solution found' } : '';
    }
    results.info = runData.result;
    results.info.runTime = runData.runTime;
    return results;
}

var runAlgorithm = function (input, goal, algorithm) {
    "use strict";
    // This is simply a wrapper function that calls the run() function of the provided algorithm object
    // and logs the running time.  The run time in seconds is returned along with the algorithm's results.
    var startTime, endTime, result;
    startTime = new Date().getTime();
    result = algorithm.run(input, goal);
    endTime = new Date().getTime();
    return { result: result, runTime: (endTime - startTime) / 1000 };
};

var swap = function (currentNodeKey, zeroIndex, swapIndex) {
    "use strict";
    // Used by getNextNodes() to generate a new puzzle state by swapping the open spot (represented by a "0")
    // with the provided swap index.
    var newNode, currentNode;
    newNode = JSON.parse(currentNodeKey);
    currentNode = JSON.parse(currentNodeKey);
    newNode[zeroIndex] = currentNode[swapIndex];
    newNode[swapIndex] = currentNode[zeroIndex];
    // The newly generated puzzle state and its zero index are returned
    return { nodeKey: JSON.stringify(newNode), zeroIndex: swapIndex };
};

exports.getFirstZeroIndex = function (inputObjectIndex) {
    "use strict";
    // This is called at the beginning of an algorithm to determine which spot in the puzzle
    // is the open spot.  After this is determined, all future puzzle states will have their zero index
    // cached as a part of their object that is stored in the solutionTree.
    var inputObject = JSON.parse(inputObjectIndex);
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

exports.getNextNodes = function (zeroIndex, currentNode) {
    "use strict";
    // This function takes a puzzle state (or "Node") and its zero index as input.  Depending on
    // the zeroIndex, a certain number of child states are possible.  For example, if the zeroIndex is 1,
    // this corresponds to the open spot of the eight puzzle being in the top left square on the board.
    // There are only two future puzzle states, one if you move the tile below the zero index up, and one
    // if you slide the tile to the right of the zero index left.  In this case, the function calls swap()
    // with inputs of '_2' and '_4' and sets them to 'rightChild' and 'downChild' respectively.
    var upChild, downChild, rightChild, leftChild, nextNodes;
    if (zeroIndex === '_1') {
        rightChild = swap(currentNode, zeroIndex, '_2');
        downChild = swap(currentNode, zeroIndex, '_4');
    }
    if (zeroIndex === '_2') {
        leftChild = swap(currentNode, zeroIndex, '_1');
        rightChild = swap(currentNode, zeroIndex, '_3');
        downChild = swap(currentNode, zeroIndex, '_5');
    }
    if (zeroIndex === '_3') {
        leftChild = swap(currentNode, zeroIndex, '_2');
        downChild = swap(currentNode, zeroIndex, '_6');
    }
    if (zeroIndex === '_4') {
        upChild = swap(currentNode, zeroIndex, '_1');
        rightChild = swap(currentNode, zeroIndex, '_5');
        downChild = swap(currentNode, zeroIndex, '_7');
    }
    if (zeroIndex === '_5') {
        upChild = swap(currentNode, zeroIndex, '_2');
        leftChild = swap(currentNode, zeroIndex, '_6');
        rightChild = swap(currentNode, zeroIndex, '_4');
        downChild = swap(currentNode, zeroIndex, '_8');
    }
    if (zeroIndex === '_6') {
        upChild = swap(currentNode, zeroIndex, '_3');
        leftChild = swap(currentNode, zeroIndex, '_5');
        downChild = swap(currentNode, zeroIndex, '_9');
    }
    if (zeroIndex === '_7') {
        upChild = swap(currentNode, zeroIndex, '_4');
        rightChild = swap(currentNode, zeroIndex, '_8');
    }
    if (zeroIndex === '_8') {
        upChild = swap(currentNode, zeroIndex, '_5');
        leftChild = swap(currentNode, zeroIndex, '_7');
        rightChild = swap(currentNode, zeroIndex, '_9');
    }
    if (zeroIndex === '_9') {
        upChild = swap(currentNode, zeroIndex, '_6');
        leftChild = swap(currentNode, zeroIndex, '_8');
    }
    // The objects themselves are stored in the NextNodes object and returned to the calling function.
    nextNodes = {};
    nextNodes.upChild = upChild;
    nextNodes.leftChild = leftChild;
    nextNodes.downChild = downChild;
    nextNodes.rightChild = rightChild;
    nextNodes.currentNode = currentNode;
    return nextNodes;
};

exports.getSolutionPath = function(solutionNode, solutionTree) {
    "use strict";
    // getSolutionPath takes the final node of a puzzle solution and the tree generated by
    // the algorithm and traces back to the top most node in the tree.  Each step, it adds
    // the node it finds to an array and this array is eventually passed back to the UI so that the
    // user can step through a solution from beginning to end.
    var solutionPath, currentNode;
    solutionPath = [];
    currentNode = solutionNode;
    solutionPath.push(solutionNode);
    while (solutionTree[currentNode].parent !== '') {
        currentNode = solutionTree[currentNode].parent;
        solutionPath.push(currentNode);
    };
    return solutionPath;
};

exports.addToSolutionTree = function (nodeToAdd, currentNode, solutionTree) {
    "use strict";
    // This function only takes a new node and adds it to a solutionTree object.  The only reason
    // this is broken out into its own function is because it is called by multiple algorithms.
    solutionTree[nodeToAdd.nodeKey] = { upChild: '',
                                        leftChild: '',
                                        downChild: '',
                                        rightChild: '',
                                        parent: currentNode,
                                        zeroIndex: nodeToAdd.zeroIndex
    };
    return solutionTree;
};
