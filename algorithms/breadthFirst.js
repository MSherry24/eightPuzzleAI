var search = require('./genericSearch');
var solutionTree = {};
/* solutionTree is the object we will use to keep track of all nodes that have been checked.
 *  The index is a stringified version of the json puzzle representation, which will be unique for each configuration.
 *  JSON.stringify() and JSON.parse() will translate the index back and forth beween a unique key and a usable object.
 *  upChild, downChild, leftChild, and rightChild, will store stringified versions of the next possible moves, parent
 *  will store a stringified version of the parent node, and zeroIndex will store the index of the open puzzle square.
 *
 *  The general pattern will be to use the stingified version of the object unless the puzzle fields are directly needed
 *  at which point the string with be parsed into an object.
 *
 * @type {{upChild: string, downChild: string, leftChild: string, rightChild: string, parent: string, zeroIndex: string}}
 */
var queue = [];
/*
 *  queue stores the puzzle states yet to be examined for breadth first search
 */

var addToSolutionTree = function (nodeToAdd, currentNode) {
    "use strict";
  console.log('addToSolutionTree 1');
    solutionTree[nodeToAdd.nodeKey] = { upChild: '', leftChild: '',
        downChild: '', rightChild: '',
        parent: currentNode, zeroIndex: nodeToAdd.zeroIndex
        };
};

var addToQueue =  function (nextNodes, currentNode) {
    "use strict";
    console.log('addToQueue');
    if (nextNodes.upChild !== undefined && solutionTree[nextNodes.upChild.nodeKey] === undefined) {
        queue.push(nextNodes.upChild.nodeKey);
        addToSolutionTree(nextNodes.upChild, currentNode);
    }
    if (nextNodes.leftChild !== undefined && solutionTree[nextNodes.leftChild.nodeKey] === undefined) {
        queue.push(nextNodes.leftChild.nodeKey);
        addToSolutionTree(nextNodes.leftChild, currentNode);
    }
    console.log('addToQueue 16');
    if (nextNodes.downChild !== undefined && solutionTree[nextNodes.downChild.nodeKey] === undefined) {
        queue.push(nextNodes.downChild.nodeKey);
        addToSolutionTree(nextNodes.downChild, currentNode);
    }
    console.log('addToQueue 17');
    if (nextNodes.rightChild !== undefined && solutionTree[nextNodes.rightChild.nodeKey] === undefined) {
        queue.push(nextNodes.rightChild.nodeKey);
        addToSolutionTree(nextNodes.rightChild, currentNode);
    }
};

var runBreadthFirstSearch = function (solution) {
    "use strict";
    var currentNode, nextNodes;
    console.log('runBreadthFirstSearch starting');
    currentNode = queue.shift();
    console.log('first current node = ' + currentNode);
    while (currentNode !== solution) {
        nextNodes = search.getNextNodes(solutionTree[currentNode].zeroIndex, currentNode);
        console.log('bfs loop 1');
        solutionTree[currentNode] = nextNodes.currentNode;
        console.log('bfs loop 2');
        addToQueue(nextNodes, currentNode);
        console.log('bfs loop 3');
        currentNode = queue.shift();
    }
    console.log("solution = " + currentNode);
    return currentNode;
};

exports.run = function (inputObjectIndex, solution) {
    console.log('run breadth first search 1');
    solutionTree[inputObjectIndex] = { upChild: '', downChild: '', leftChild: '',
        rightChild: '', zeroIndex: '', parent: ''};
    console.log('run breadth first search 2');
    console.log('inputObjectIndex = ' + inputObjectIndex);
    console.log('solution = ' + solution);
    solutionTree[inputObjectIndex].zeroIndex = search.getFirstZeroIndex(inputObjectIndex);
    console.log('firstZeroIndex = ' + solutionTree[inputObjectIndex].zeroIndex);
    queue.push(inputObjectIndex);
    runBreadthFirstSearch(solution);
};
/* exports.run is the driver for breadth first search.  It can be called from another file and takes a JSON object
 * representation of a puzzle board as an input.
 */



