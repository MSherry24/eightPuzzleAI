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


var getSearch = function (algorithm) {
    "use strict";
    console.log('getSearch');
    if (algorithm === 'Breadth') {
        return breadth;
    }
    if (algorithm === 'Depth' || algorithm === 'Iterative') {
        return depth;
    }
};

// Returns solution Tree
exports.run = function (input, goal, algorithm, rootNode,
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
                                                    rootNode, search);
    }
    console.log('returning results');
    return results;
};

var runSearch = function (input, goal, solutionTree,
                         addToSolutionTree, successorFunction,
                         search, maxDepth) {
        "use strict";
        var currentKey, nextNodes, currentDepth, maxDepthReached;
        //console.log('genericSearch.runSearch');
        maxDepthReached = (maxDepth === '') ? true : false;
        currentKey = input;
        currentDepth = 0;
        console.log('maxdepth = ' + maxDepth);
        while (currentKey !== goal && currentKey !== undefined) {
            nextNodes = successorFunction(currentKey, solutionTree);
            nextNodes.map(function (node) {
                if (node.key !== '' && (solutionTree[node.key] === undefined || solutionTree[node.key].depth > currentDepth)) {
                        solutionTree = addToSolutionTree(node, currentKey, solutionTree);
                        solutionTree[node.key].depth = solutionTree[currentKey].depth + 1;
                    if (maxDepth === '' || solutionTree[node.key].depth < maxDepth) {
                        search.addNode(node.key);
                    }
                }
            });
            currentKey = search.getNextNode();
            if (currentKey !== undefined) {
                currentDepth = solutionTree[currentKey].depth;
                if (maxDepthReached === false && currentDepth === maxDepth) {
                    maxDepthReached = true;
                }
            }
        }
        // For the case of Iterative deepening, it's possible that the goal state was not found, but
        // the loop ended.  In this case, maxDepth is equal to currentDepth when the loop ended, and
        // false is returned as a signal to runIterativeDeepening() that it needs to run again with
        // a higher maxDepth value.  If currentDepth is less than maxDepth, the algorithm ran out of
        // nodes to examine before it reached the maxDepth, so all reachable states have been examined.
        // If all possible states have been examined and no solution is found, undefined is returned.
        // Otherwise, the solutionTree is returned.
        if (currentKey === goal) { return solutionTree; }
        if (search.isEmpty() && maxDepthReached === true) { return undefined; }
        return false;
    };

var runIterativeDeepening = function (input, goal, solutionTree,
                                     addToSolutionTree, successorFunction,
                                     rootNode, search) {
        "use strict";
        var solution, depth;
        solution = false;
        depth = 0;
        while (solution === false) {
            depth++;
            solutionTree = {};
            solutionTree[input] = rootNode;
            solution = runSearch(input, goal, solutionTree,
                                 addToSolutionTree, successorFunction,
                                 search, depth);
        }
        return solution;
    };