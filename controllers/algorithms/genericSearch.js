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


var getSearch = function(algorithm) {
    if (algorithm === 'Breadth') {
        return breadth;
    } else if (algorithm === 'Depth') {
        return depth;
    }
};

exports.run = function(input, goal, algorithm, rootNode,
                       addToSolutionTree, successorFunction) {
    "use strict";
    var solutionTree, search, results;
    // create solution tree and add in root node
    solutionTree = {};
    solutionTree[input] = rootNode;
    // Find correct search object
    search = getSearch(algorithm);
    // Run search
    results = search.run(input, goal, solutionTree,
                            addToSolutionTree, successorFunction);


    return results;
};




/**
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
 **/






