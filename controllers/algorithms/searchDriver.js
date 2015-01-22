var breadth = require('./breadthFirst');
var depth = require('./depthFirst');
var greedy = require('./greedyBestFirst');

var getSearch = function (algorithm) {
    "use strict";
    console.log('getSearch');
    if (algorithm === 'Breadth') {
        return breadth;
    }
    if (algorithm === 'Depth' || algorithm === 'Iterative') {
        return depth;
    }
    if (algorithm === 'Greedy') {
        return greedy;
    }
};

var runSearch = function (puzzleInfo, puzzleFunctions, solutionTree, search, maxDepth) {
    "use strict";
    var currentKey, nextNodes, currentDepth, nodesCreated, nodesVisited, maxDepthReached, isNotIterativeDeepening;
    isNotIterativeDeepening = maxDepth === '';
    maxDepthReached = false;
    currentKey = puzzleInfo.input;
    currentDepth = 0;
    nodesCreated = 0;
    nodesVisited = 0;
    /*
     *  The first thing to check is if the current key is the goal, and if it is, return it.
     *  Next, check to see if the currentKey is undefined.  This is a signal that the queue is empty and
     *  no solution was found.  In which case, the while loop should end.
     */
    while (currentKey !== puzzleInfo.goal && currentKey !== undefined) {
        /*
         * The successorFunction returns an array of the next possible nodes.  An anonymous function is
         * then mapped to each node in the array.
         */
        nextNodes = puzzleFunctions.successorFunction(currentKey, solutionTree);
        nextNodes.map(function (node) {
            // If the key is an empty string, the anonymous function determined that it is invalid for some reason
            if (node.key !== ''
                    // If the key is not already in the tree (i.e. returns undefined), continue.
                    && (solutionTree[node.key] === undefined
                    // If the key is already in the tree, only continue if this is an iterative deepening
                    // search and the depth of the current node is less than when it was examined previously
                    || (!isNotIterativeDeepening && solutionTree[node.key].depth > currentDepth))) {
                // If all of the previous checks passed, add the node to the solution tree hash map and
                // increase its depth by one (compared to its parent node)
                solutionTree = puzzleFunctions.addToSolutionTree(node, currentKey, solutionTree);
                solutionTree[node.key].depth = solutionTree[currentKey].depth + 1;
                nodesCreated++;
                // If this is not an iterative deepening search, add the node to the queue
                // If it is an iterative deepening search, only add the node if its depth doesn't
                // exceed the maximum depth allowed by this iteration.
                if (isNotIterativeDeepening || solutionTree[node.key].depth <= maxDepth) {
                    search.addNode(node.key);
                }
            }
        });
        nodesVisited++;
        // If the current depth is equal to the max depth, set the maxDepthReached flag to true
        // This flag is used after the loop ends to determine if another iteration of the iterative
        // deepening algorithm should be run.
        if (!isNotIterativeDeepening && !maxDepthReached && currentDepth === maxDepth) {
            maxDepthReached = true;
        }
        // Get the next node from the queue
        currentKey = search.getNextNode();
        currentDepth = solutionTree[currentKey] === undefined ? currentDepth : solutionTree[currentKey].depth;
    }
    // If the goal state was found, return the solution tree and the information about nodes created/visited
    if (currentKey === puzzleInfo.goal) { return {solutionTree: solutionTree,
        nodesCreated: nodesCreated,
        nodesVisited: nodesVisited}; }
    // If max depth is not reached before the queue empties, maxDepthReached will still be false.  This shows that
    // all reachable states were checked before the max depth was reached, so another round of iterative deepending
    // will also not find a solution.  Therefore, no solution is possible.
    if (search.isEmpty() && maxDepthReached === false) {
        return {
            solutionTree: undefined,
            nodesCreated: nodesCreated,
            nodesVisited: nodesVisited
        };
    }
    // Otherwise, another round of iterative deepening is required.  False is returned instead of a solution tree
    // as a signal to runIterativeDeepening that it should run another iteration.
    return {
        solutionTree: false,
        nodesCreated: nodesCreated,
        nodesVisited: nodesVisited
    };
};

var runIterativeDeepening = function (puzzleInfo, puzzleFunctions, solutionTree, search) {
    "use strict";
    var results, depth, nodesVisitedTally, nodesCreatedTally;
    nodesVisitedTally = 0;
    nodesCreatedTally = 0;
    results = {solutionTree: false, nodesCreated: nodesCreatedTally, nodesVisited: nodesVisitedTally};
    depth = 0;
    while (results.solutionTree === false) {
        depth++;
        console.log('depth = ' + depth);
        solutionTree = {};
        solutionTree[puzzleInfo.input] = puzzleInfo.rootNode;
        results = runSearch(puzzleInfo, puzzleFunctions, solutionTree, search, depth);
        nodesCreatedTally += results.nodesCreated;
        nodesVisitedTally += results.nodesVisited;
    }
    return {solutionTree: solutionTree, nodesCreated: nodesCreatedTally, nodesVisited: nodesVisitedTally};
};

// Returns solution Tree
exports.run = function (puzzleInfo, puzzleFunctions) {
    "use strict";
    var solutionTree, search, results, solution;
    console.log('genericSearch.run');
    // initialize variables
    solutionTree = {};
    results = {};
    solution = {};
    solutionTree[puzzleInfo.input] = puzzleInfo.rootNode;
    // Find correct search object
    search = getSearch(puzzleInfo.algorithm);
    // clear out anything left over in the queue from previous runs
    search.clearQueue();
    // Run search
    if (puzzleInfo.algorithm === 'Breadth' || puzzleInfo.algorithm === 'Depth') {
        results =  runSearch(puzzleInfo, puzzleFunctions, solutionTree, search, '');
    }
    if (puzzleInfo.algorithm === 'Iterative') {
        results = runIterativeDeepening(puzzleInfo, puzzleFunctions, solutionTree, search);
    }
    // return results
    solution.solutionTree = results.solutionTree;
    solution.nodesVisited = results.nodesVisited;
    solution.nodesCreated = results.nodesCreated;
    solution.error = results.solutionTree === undefined ? "No Solution Found" : "";
    solution.queueMax = search.getMaxLength();
    console.log('returning results');
    return solution;
};