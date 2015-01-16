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
    //console.log('genericSearch.runSearch');
    currentKey = input;
    currentDepth = 0;
    while (currentKey !== goal && currentKey !== undefined) {
        nextNodes = successorFunction(currentKey, solutionTree);
        nextNodes.map(function(node) {
            if (node.key !== '' && solutionTree[node.key] === undefined) {
                solutionTree = addToSolutionTree(node, currentKey, solutionTree);
                solutionTree[node.key].depth++;
                if (maxDepth === '' || currentDepth > maxDepth) {
                    console.log('adding node');
                    search.addNode(node.key);
                }
            }
        });
        currentKey = search.getNextNode();
        console.log('currentKey = ' + currentKey);

        if (currentKey !== undefined) {
            console.log('solutionTree[currentKey].depth = ' + solutionTree[currentKey].depth);
            currentDepth = solutionTree[currentKey].depth;
        }
        console.log('currentDepth = ' + currentDepth + ' maxDepth = ' + maxDepth);
    }
    // For the case of Iterative deepening, it's possible that the goal state was not found, but
    // the loop ended.  In this case, maxDepth is equal to currentDepth when the loop ended, and
    // false is returned as a signal to runIterativeDeepening() that it needs to run again with
    // a higher maxDepth value.  If currentDepth is less than maxDepth, the algorithm ran out of
    // nodes to examine before it reached the maxDepth, so all reachable states have been examined.
    // If all possible states have been examined and no solution is found, undefined is returned.
    // Otherwise, the solutionTree is returned.
    if ( currentKey === goal ) {return solutionTree; }
    else if ( currentDepth = maxDepth ) { return false; }
    else { return undefined;  }
};

var runIterativeDeepening = function(input, goal, solutionTree,
                                     addToSolutionTree, successorFunction,
                                     search) {
    "use strict";
    var solution, depth;
    solution = false;
    depth = 0;
    while (solution === false) {
        depth++;
        //console.log('next depth = ' + depth);
        solution = runSearch(input, goal, solutionTree,
                             addToSolutionTree, successorFunction,
                             search, depth);
    }
    return solution;
}