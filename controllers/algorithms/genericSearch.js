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
    "use strict";
    console.log('getSearch');
    if (algorithm === 'Breadth') {
        return breadth;
    } else if (algorithm === 'Depth' || algorithm === 'Iterative') {
        return depth;
    }
};

// Returns solution Tree
exports.run = function(input, goal, algorithm, rootNode,
                       addToSolutionTree, successorFunction) {
    "use strict";
    var solutionTree, search, results;
    console.log('genericSearch.run');
    // create empty results object and empty solution tree. Add root node to SolutionTree
    solutionTree = {};
    results = {};
    solutionTree[input] = rootNode;
    // Find correct search object
    search = getSearch(algorithm);
    // clear out anything left over in the queue from previous runs
    search.clearQueue();
    // Run search
    if (algorithm === 'Breadth' || algorithm === 'Depth') {
        results.solutionTree =  runSearch(input, goal, solutionTree,
                                            addToSolutionTree, successorFunction,
                                            search, '');
    }
    if (algorithm === 'Iterative') {
        results.solutionTree = runIterativeDeepening(input, goal, solutionTree,
                                                    addToSolutionTree, successorFunction,
                                                    search);
    }
    console.log('returning results');
    return results;
};

var runSearch = function(input, goal, solutionTree,
                         addToSolutionTree, successorFunction,
                         search, maxDepth) {
    "use strict";
    var currentKey, nextNodes, currentDepth;
    console.log('genericSearch.runSearch');
    currentKey = input;
    currentDepth = 0;
    while (currentKey !== goal && (maxDepth === '' || currentDepth < maxDepth)) {
        nextNodes = successorFunction(currentKey, solutionTree);
        nextNodes.map(function(node) {
            if (node.key !== '' && solutionTree[node.key] === undefined) {
                solutionTree = addToSolutionTree(node, currentKey, solutionTree);
                search.addNode(node.key);
            }
        });
        currentKey = search.getNextNode();
        currentDepth = solutionTree[currentKey].depth;
    }
    // For the case of Iterative deepening, it's possible that the goal state was not found, but
    // the loop ended.  In this case, false is returned as a signal to runIterativeDeepening() that
    // it needs to run again with a higher maxDepth value.
    if (currentKey !== goal) { return false; }
    // Otherwise, the solutionTree is returned.
    else { return solutionTree; }
};

var runIterativeDeepening = function(input, goal, solutionTree,
                                     addToSolutionTree, successorFunction,
                                     search) {
    "use strict";

    return solutionTree;
}