var search = require('./genericSearch');
var queue = [];

var addNode = function (key) {
    queue.push(key);
};

var getNextNode = function () {
    return queue.shift();
};

exports.run = function(input, goal, solutionTree,
                        addToSolutionTree, successorFunction) {
    "use strict";
    var currentKey, nextNodes;
    currentKey = input;
    while (currentKey !== goal) {
        nextNodes = successorFunction(currentKey, solutionTree);
    }


}

/* exports.run is the driver for breadth first search.  It can be called from another file and takes stringified
 * JSON representations of the puzzle board and the solution as an input.
 *
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
*/



