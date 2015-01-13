var search = require('./genericSearch');
/*
 *  queue stores the puzzle states yet to be examined for breadth first search
 */
var queue = [];
var nodesCreated;
var nodesExamined;
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

var addToQueue = function (nextNodes, currentNode) {
    "use strict";
    // Each child node that exists will be put onto the queue and added to the solution tree
    if (nextNodes.upChild !== undefined && solutionTree[nextNodes.upChild.nodeKey] === undefined) {
        queue.push(nextNodes.upChild.nodeKey);
        solutionTree = search.addToSolutionTree(nextNodes.upChild, currentNode, solutionTree);
        nodesCreated++;
    }
    if (nextNodes.leftChild !== undefined && solutionTree[nextNodes.leftChild.nodeKey] === undefined) {
        queue.push(nextNodes.leftChild.nodeKey);
        solutionTree = search.addToSolutionTree(nextNodes.leftChild, currentNode, solutionTree);
        nodesCreated++;
    }
    if (nextNodes.downChild !== undefined && solutionTree[nextNodes.downChild.nodeKey] === undefined) {
        queue.push(nextNodes.downChild.nodeKey);
        solutionTree = search.addToSolutionTree(nextNodes.downChild, currentNode, solutionTree);
        nodesCreated++;
    }
    if (nextNodes.rightChild !== undefined && solutionTree[nextNodes.rightChild.nodeKey] === undefined) {
        queue.push(nextNodes.rightChild.nodeKey);
        solutionTree = search.addToSolutionTree(nextNodes.rightChild, currentNode, solutionTree);
        nodesCreated++;
    }
};

var runBreadthFirstSearch = function (solution) {
    "use strict";
    var currentNode, nextNodes;
    console.log('runBreadthFirstSearch starting');
    currentNode = queue.shift();
    while (currentNode !== solution && currentNode !== undefined) {
        // getNextNodes() determines all possibles moves that can be made and what the next
        // state will look like based on each move.  This information is returned and stored
        // as "nextNodes"
        nextNodes = search.getNextNodes(solutionTree[currentNode].zeroIndex, currentNode);
        // Set the nextNodes to be the children of the current node
        solutionTree[currentNode].leftChild = nextNodes.currentNode.leftChild;
        solutionTree[currentNode].upChild = nextNodes.currentNode.upChild;
        solutionTree[currentNode].rightChild = nextNodes.currentNode.rightChild;
        solutionTree[currentNode].downChild = nextNodes.currentNode.downChild;
        // addToStack puts each child node on the queue and adds them to "solutionTree"
        addToQueue(nextNodes, currentNode);
        // get the next node to examine
        currentNode = queue.shift();
        // increment the nodesExamined counter
        nodesExamined++;
    }
    console.log("solution = " + currentNode);
    if (currentNode === undefined) { return { error: 'All possible paths examined.  No solution found.' }; }
    return currentNode;
};

/* exports.run is the driver for breadth first search.  It can be called from another file and takes stringified
 * JSON representations of the puzzle board and the solution as an input.
 */
exports.run = function (inputObjectIndex, solution) {
    console.log('input = ' + inputObjectIndex);
    var solutionNode, results;
    // Variable Initialization
    solutionTree = {};
    queue = [];
    nodesCreated = 1;
    nodesExamined = 1;
    results = {solutionPath: [] };
    solutionTree[inputObjectIndex] = { upChild: '', downChild: '', leftChild: '',
        rightChild: '', zeroIndex: '', parent: ''};
    // Set the zero index for the top node of the tree
    solutionTree[inputObjectIndex].zeroIndex = search.getFirstZeroIndex(inputObjectIndex);
    // Push the input node into the stack so that it is the first node examined
    queue.push(inputObjectIndex);

    // Run the algorithm
    solutionNode = runBreadthFirstSearch(solution);

    // Parse out data and return as the results object.
    if (solutionNode.error !== undefined) { return solutionNode; }
    results.solutionPath = search.getSolutionPath(solutionNode, solutionTree);
    results.lengthOfSolution = results.solutionPath.length;
    results.solutionTree = solutionTree;
    results.nodesCreated = nodesCreated;
    results.nodesExamined = nodesExamined;
    return results;
};




