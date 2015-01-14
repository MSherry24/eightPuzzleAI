/**
 * Created by Mike on 1/10/2015.
 *
 */
var search = require('./genericSearch');
exports.run = function (input, goal, algorithm) {
    "use strict";
    var results, rootNode;
    // create root Node
    rootNode = {
        upChild: '',
        leftChild: '',
        downChild: '',
        rightChild: '',
        parent: 'root',
        zeroIndex: getFirstZeroIndex(input),
        whatChildIsThis: 'root'
    }
    results = search.run(input, goal, algorithm, rootNode,
                            addToSolutionTree, successorFunction);

    // Add the user's input and algorithm choice to the results object so that it can be
    // displayed back to the user along with the puzzle results
    results.info.input = input;
    results.info.algorithm = algorithm;
    return results;
};

var getFirstZeroIndex = function (inputObjectIndex) {
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

var addToSolutionTree = function (nodeToAdd, currentNode, solutionTree, whatChild) {
    "use strict";
    // This function only takes a new node and adds it to a solutionTree object.  The only reason
    // this is broken out into its own function is because it is called by multiple algorithms.
    solutionTree[nodeToAdd.nodeKey] = {
        upChild: '',
        leftChild: '',
        downChild: '',
        rightChild: '',
        parent: currentNode,
        zeroIndex: nodeToAdd.zeroIndex,
        whatChildIsThis: whatChild
    };
    return solutionTree;
};

var successorFunction = function (currentNode, solutionTree) {
    "use strict";
    // This function takes a puzzle state (or "Node") and its zero index as input.  Depending on
    // the zeroIndex, a certain number of child states are possible.  For example, if the zeroIndex is 1,
    // this corresponds to the open spot of the eight puzzle being in the top left square on the board.
    // There are only two future puzzle states, one if you move the tile below the zero index up, and one
    // if you slide the tile to the right of the zero index left.  In this case, the function calls swap()
    // with inputs of '_2' and '_4' and sets them to 'rightChild' and 'downChild' respectively.
    var upChild, downChild, rightChild, leftChild, nextNodes, swap, zeroIndex;
    swap = function (currentKey, zeroIndex, swapIndex) {
        "use strict";
        // Used by getNextNodes() to generate a new puzzle state by swapping the open spot (represented by a "0")
        // with the provided swap index.
        var newNode, currentNode;
        newNode = JSON.parse(currentKey);
        currentNode = JSON.parse(currentKey);
        newNode[zeroIndex] = currentNode[swapIndex];
        newNode[swapIndex] = currentNode[zeroIndex];
        // The newly generated puzzle state and its zero index are returned
        return { nodeKey: JSON.stringify(newNode), zeroIndex: swapIndex };
    };
    zeroIndex = solutionTree[currentNode].zeroIndex
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
    // The objects themselves are stored in the NextNodes array and returned to the calling function.
    nextNodes = [];
    nextNodes.push({key: upChild, whatChildIsThis: 'UP'});
    nextNodes.push({key: leftChild, whatChildIsThis: 'LEFT'});
    nextNodes.push({key: downChild, whatChildIsThis: 'DOWN'});
    nextNodes.push({key: rightChild, whatChildIsThis: 'RIGHT'});
    nextNodes.currentNode = currentNode;
    return nextNodes;
};





