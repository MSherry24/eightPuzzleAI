var search = require('./genericSearch');
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
var solutionTree = {};
/*
 *  stack stores the puzzle states yet to be examined for breadth first search
 *  @type []
 */
var stack;
var nodesCreated;
var nodesExamined;

var addToStack =  function (nextNodes, currentNode) {
    "use strict";
    if (nextNodes.upChild !== undefined && solutionTree[nextNodes.upChild.nodeKey] === undefined) {
        stack.push(nextNodes.upChild.nodeKey);
        solutionTree = search.addToSolutionTree(nextNodes.upChild, currentNode, solutionTree);
        nodesCreated++;
    }
    if (nextNodes.leftChild !== undefined && solutionTree[nextNodes.leftChild.nodeKey] === undefined) {
        stack.push(nextNodes.leftChild.nodeKey);
        solutionTree = search.addToSolutionTree(nextNodes.leftChild, currentNode, solutionTree);
        nodesCreated++;
    }
    if (nextNodes.downChild !== undefined && solutionTree[nextNodes.downChild.nodeKey] === undefined) {
        stack.push(nextNodes.downChild.nodeKey);
        solutionTree = search.addToSolutionTree(nextNodes.downChild, currentNode, solutionTree);
        nodesCreated++;
    }
    if (nextNodes.rightChild !== undefined && solutionTree[nextNodes.rightChild.nodeKey] === undefined) {
        stack.push(nextNodes.rightChild.nodeKey);
        solutionTree = search.addToSolutionTree(nextNodes.rightChild, currentNode, solutionTree);
        nodesCreated++;
    }
};

var runDepthFirstSearch = function (solution) {
    "use strict";
    var currentNode, nextNodes;
    console.log('runBreadthFirstSearch starting');
    currentNode = stack.pop();
    while (currentNode !== solution && currentNode !== undefined) {
        nextNodes = search.getNextNodes(solutionTree[currentNode].zeroIndex, currentNode);
        solutionTree[currentNode].leftChild = nextNodes.currentNode.leftChild;
        solutionTree[currentNode].upChild = nextNodes.currentNode.upChild;
        solutionTree[currentNode].rightChild = nextNodes.currentNode.rightChild;
        solutionTree[currentNode].downChild = nextNodes.currentNode.downChild;
        addToStack(nextNodes, currentNode);
        currentNode = stack.pop();
        nodesExamined++;
    }
    console.log("solution = " + currentNode);
    if (currentNode === undefined) { return { error: 'All possible paths examined.  No solution found.' }; }
    return currentNode;
};

exports.run = function (inputObjectIndex, solution) {
    console.log('input = ' + inputObjectIndex);
    var solutionNode, results;
    solutionTree = {};
    stack = [];
    nodesCreated = 1;
    nodesExamined = 1;
    results = {solutionPath: [] };
    solutionTree[inputObjectIndex] = { upChild: '', downChild: '', leftChild: '',
        rightChild: '', zeroIndex: '', parent: ''};
    solutionTree[inputObjectIndex].zeroIndex = search.getFirstZeroIndex(inputObjectIndex);
    stack.push(inputObjectIndex);
    solutionNode = runDepthFirstSearch(solution);
    if (solutionNode.error !== undefined) { return solutionNode; }
    results.solutionPath = search.getSolutionPath(solutionNode, solutionTree);
    results.lengthOfSolution = results.solutionPath.length;
    results.solutionTree = solutionTree;
    results.nodesCreated = nodesCreated;
    results.nodesExamined = nodesExamined;
    return results;
};
/* exports.run is the driver for depth first search.  It can be called from another file and takes stringified
 * JSON representations of the puzzle board and the solution as an input.
 */