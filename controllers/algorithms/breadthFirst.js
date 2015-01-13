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
var nodesCreated;
var nodesExamined;
/*
 *  queue stores the puzzle states yet to be examined for breadth first search
 */

var addToSolutionTree = function (nodeToAdd, currentNode) {
    "use strict";
    console.log('addToSolutionTree');
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
        nodesCreated++;
    }
    if (nextNodes.leftChild !== undefined && solutionTree[nextNodes.leftChild.nodeKey] === undefined) {
        queue.push(nextNodes.leftChild.nodeKey);
        addToSolutionTree(nextNodes.leftChild, currentNode);
        nodesCreated++;
    }
    if (nextNodes.downChild !== undefined && solutionTree[nextNodes.downChild.nodeKey] === undefined) {
        queue.push(nextNodes.downChild.nodeKey);
        addToSolutionTree(nextNodes.downChild, currentNode);
        nodesCreated++;
    }
    if (nextNodes.rightChild !== undefined && solutionTree[nextNodes.rightChild.nodeKey] === undefined) {
        queue.push(nextNodes.rightChild.nodeKey);
        addToSolutionTree(nextNodes.rightChild, currentNode);
        nodesCreated++;
    }
};

var runBreadthFirstSearch = function (solution) {
    "use strict";
    var currentNode, nextNodes;
    console.log('runBreadthFirstSearch starting');
    currentNode = queue.shift();
    while (currentNode !== solution && currentNode !== undefined) {
        nextNodes = search.getNextNodes(solutionTree[currentNode].zeroIndex, currentNode);
        solutionTree[currentNode].leftChild = nextNodes.currentNode.leftChild;
        solutionTree[currentNode].upChild = nextNodes.currentNode.upChild;
        solutionTree[currentNode].rightChild = nextNodes.currentNode.rightChild;
        solutionTree[currentNode].downChild = nextNodes.currentNode.downChild;
        addToQueue(nextNodes, currentNode);
        currentNode = queue.shift();
        nodesExamined++;
    }
    console.log("solution = " + currentNode);
    if (currentNode === undefined) { return { error: 'All possible paths examined.  No solution found.' }; }
    return currentNode;
};

exports.run = function (inputObjectIndex, solution) {
    console.log('run breadth first search');
    console.log('input = ' + inputObjectIndex);
    var solutionNode, results;
    solutionTree = {};
    queue = [];
    nodesCreated = 1;
    nodesExamined = 1;
    results = {solutionPath: [] };
    solutionTree[inputObjectIndex] = { upChild: '', downChild: '', leftChild: '',
        rightChild: '', zeroIndex: '', parent: ''};
    solutionTree[inputObjectIndex].zeroIndex = search.getFirstZeroIndex(inputObjectIndex);
    queue.push(inputObjectIndex);
    solutionNode = runBreadthFirstSearch(solution);
    if (solutionNode.error !== undefined) { return solutionNode; }
    results.solutionPath = search.getSolutionPath(solutionNode, solutionTree);
    results.lengthOfSolution = results.solutionPath.length;
    results.solutionTree = solutionTree;
    results.nodesCreated = nodesCreated;
    results.nodesExamined = nodesExamined;
    return results;

};
/* exports.run is the driver for breadth first search.  It can be called from another file and takes stringified
 * JSON representations of the puzzle board and the solution as an input.
 */



