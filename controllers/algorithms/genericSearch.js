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

var runSearch = function (input, goal, solutionTree,
                         addToSolutionTree, successorFunction,
                         nodesVisited, nodesCreated,
                         search, maxDepth) {
        "use strict";
        var currentKey, nextNodes, currentDepth, maxDepthReached, isNotIterativeDeepening;
        isNotIterativeDeepening = maxDepth === '';
        maxDepthReached = maxDepth === '';
        currentKey = input;
        currentDepth = 0;
        while (currentKey !== goal && currentKey !== undefined) {
            /*
             *  The first thing to check is if the current key is the goal, and if it is, return it.
             *  Next, check to see if the currentKey is undefined.  This is a signal that the queue is empty and
             *  no solution was found.  In which case, the while loop should end.
             */
            nextNodes = successorFunction(currentKey, solutionTree);
            /*
             * The successorFunction returns an array of the next possible nodes.  An anonymous function is
             * then mapped to each node in the array.
             */
            nextNodes.map(function (node) {
                // If the key is an empty string, the anonymous function determined that it is invalid for some reason
                if (node.key !== ''
                        // If the key is not already in the tree, continue.
                        && (solutionTree[node.key] === undefined
                        // If the key is already in the tree, only continue if this is an iterative deepening
                        // search and the depth of the current node is less than when it was examined previously
                        || (isNotIterativeDeepening && solutionTree[node.key].depth > currentDepth))) {
                    // If all of the previous checks passed, add the node to the solution tree hash map and
                    // increase its depth by one (compared to its parent node)
                    solutionTree = addToSolutionTree(node, currentKey, solutionTree);
                    solutionTree[node.key].depth = solutionTree[currentKey].depth + 1;
                    nodesCreated++;
                    // If this is not an iterative deepening search, add the node to the queue
                    // If it is an iterative deepening search, only add the node if its depth doesn't
                    // exceed the maximum depth allowed by this iteration.
                    if (isNotIterativeDeepening || solutionTree[node.key].depth < maxDepth) {
                        search.addNode(node.key);
                    }
                }
            });
            nodesVisited++;
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
        if (currentKey === goal) { return {solutionTree: solutionTree, nodesCreated: nodesCreated, nodesVisited: nodesVisited}; }
        if (search.isEmpty() && maxDepthReached === true) { return undefined; }
        return {solutionTree: false, nodesCreated: nodesCreated, nodesVisited: nodesVisited};
    };

var runIterativeDeepening = function (input, goal, solutionTree,
                                     addToSolutionTree, successorFunction,
                                     rootNode, search) {
        "use strict";
        var results, depth, nodesVistitedTally, nodesCreatedTally;
        nodesVistitedTally = 0;
        nodesCreatedTally = 0;
        results = {solutionTree: false, nodesCreated: nodesCreatedTally, nodesVisited: nodesVistitedTally};
        depth = 0;
        while (results.solutionTree === false) {
            depth++;
            solutionTree = {};
            solutionTree[input] = rootNode;
            results = runSearch(input, goal, solutionTree,
                                 addToSolutionTree, successorFunction,
                                 nodesVistitedTally, nodesCreatedTally,
                                 search, depth);
            nodesCreatedTally += results.nodesCreated;
            nodesVistitedTally += results.nodesVisited;
            //console.log('depth = ' + depth + ' nodesCreated = ' + nodesCreatedTally + ' nodesVisited = ' + nodesVistitedTally);
        }
        return {solutionTree: solutionTree, nodesCreated: nodesCreatedTally, nodesVisited: nodesVistitedTally};
    };

// Returns solution Tree
exports.run = function (input, goal, algorithm, rootNode,
                        addToSolutionTree, successorFunction) {
    "use strict";
    var solutionTree, search, results, nodesVisited, nodesCreated, solution;
    console.log('genericSearch.run');
    // initialize variables
    nodesCreated = 0;
    nodesVisited = 0;
    solutionTree = {};
    results = {};
    solution = {};
    solutionTree[input] = rootNode;
    // Find correct search object
    search = getSearch(algorithm);
    // clear out anything left over in the queue from previous runs
    search.clearQueue();
    // Run search
    if (algorithm === 'Breadth' || algorithm === 'Depth') {
        results =  runSearch(input, goal, solutionTree,
            addToSolutionTree, successorFunction,
            nodesVisited, nodesCreated,
            search, '');
    }
    if (algorithm === 'Iterative') {
        results = runIterativeDeepening(input, goal, solutionTree,
            addToSolutionTree, successorFunction,
            rootNode, search);
    }
    // return results
    solution.solutionTree = results.solutionTree;
    solution.nodesVisited = results.nodesVisited;
    solution.nodesCreated = results.nodesCreated;
    solution.queueMax = breadth.getMaxLength();
    console.log('returning results');
    return solution;
};