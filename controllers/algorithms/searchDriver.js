var breadth = require('./breadthFirst');
var depth = require('./depthFirst');
var greedy = require('./greedyBestFirst');
var aStar = require('./aStar');

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
    if (algorithm === 'A* Tiles' || algorithm === 'A* Manhattan') {
        return aStar;
    }
};

var runSearch = function (puzzleInfo, puzzleFunctions, solutionTree, search, maxDepth) {
    "use strict";
    var currentKey, nextNodes, currentDepth, maxDepthReached, isNotIterativeDeepening;
    isNotIterativeDeepening = maxDepth === '';
    maxDepthReached = false;
    currentKey = puzzleInfo.input;
    currentDepth = 0;
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
                // If all of the previous checks passed, add the node to the solution tree hash map
                solutionTree = puzzleFunctions.addToSolutionTree(node, currentKey, solutionTree, puzzleFunctions.evaluateHeuristic);
                // If this is not an iterative deepening search, add the node to the queue
                // If it is an iterative deepening search, only add the node if its depth doesn't
                // exceed the maximum depth allowed by this iteration.
                if (isNotIterativeDeepening || solutionTree[node.key].depth <= maxDepth) {
                    search.addNode(node.key);
                }
            }
        });
        // If the current depth is equal to the max depth, set the maxDepthReached flag to true
        // This flag is used after the loop ends to determine if another iteration of the iterative
        // deepening algorithm should be run.
        if (!isNotIterativeDeepening && !maxDepthReached && currentDepth === maxDepth) {
            maxDepthReached = true;
        }
        // Get the next node from the queue
        currentKey = search.getNextNode(solutionTree);
        currentDepth = solutionTree[currentKey] === undefined ? currentDepth : solutionTree[currentKey].depth;
    }
    // If the goal state was found, return the solution tree and the information about nodes created/visited
    if (currentKey === puzzleInfo.goal) { return solutionTree; }
    // If max depth is not reached before the queue empties, maxDepthReached will still be false.  This shows that
    // all reachable states were checked before the max depth was reached, so another round of iterative deepending
    // will also not find a solution.  Therefore, no solution is possible.
    if (search.isEmpty() && maxDepthReached === false) { return undefined; }
    // Otherwise, another round of iterative deepening is required.  False is returned instead of a solution tree
    // as a signal to runIterativeDeepening that it should run another iteration.
    return false;
};

var runIterativeDeepening = function (puzzleInfo, puzzleFunctions, solutionTree, search) {
    "use strict";
    var results, depth;
    results = false;
    depth = 0;
    while (results === false) {
        depth++;
        //console.log('depth = ' + depth);
        solutionTree = {};
        solutionTree[puzzleInfo.input] = puzzleInfo.rootNode;
        results = runSearch(puzzleInfo, puzzleFunctions, solutionTree, search, depth);
    }
    return results;
};

var runHeuristicSearch = function (puzzleInfo, puzzleFunctions, solutionTree, search) {
    "use strict";
    var currentKey, nextNodes, currentDepth, bestSolutionDepth;
    currentKey = puzzleInfo.input;
    currentDepth = 0;
    bestSolutionDepth = Infinity;
    while (currentKey !== undefined && bestSolutionDepth > solutionTree[currentKey].depth) {
        /*
         * The successorFunction returns an array of the next possible nodes.  An anonymous function is
         * then mapped to each node in the array.
         */
        //console.log('f(n) = ' + (solutionTree[currentKey].hnScore + solutionTree[currentKey].gnScore)
        //                + ' g(n) = ' + solutionTree[currentKey].gnScore + ' h(n) = ' + solutionTree[currentKey].hnScore);
        nextNodes = puzzleFunctions.successorFunction(currentKey, solutionTree);
        nextNodes.map(function (node) {
            // If the key is an empty string, the anonymous function determined that it is invalid for some reason
            if (node.key !== '') {
                if (solutionTree[node.key] === undefined || solutionTree[node.key].depth > (currentDepth + 1)) {
                    // Add the node to the queue
                    solutionTree = puzzleFunctions.addToSolutionTree(node, currentKey, solutionTree, puzzleFunctions.evaluateHeuristic);
                    search.addNode(node.key);
                }
            }
        });
        currentKey = search.getNextNode(solutionTree);
        currentDepth = solutionTree[currentKey] === undefined ? currentDepth : solutionTree[currentKey].depth;
        if (currentKey === puzzleInfo.goal) {
            bestSolutionDepth = currentDepth < bestSolutionDepth ? currentDepth : bestSolutionDepth;
            console.log('solution found: bestSolutionDepth = ' + bestSolutionDepth);
        }
    }
    // If the goal state was found, return the solution tree and the information about nodes created/visited
    if (bestSolutionDepth !== Infinity) {
        return solutionTree;
    }
    return undefined;
};

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
    if (puzzleInfo.algorithm === 'Iterative') {
        results = runIterativeDeepening(puzzleInfo, puzzleFunctions, solutionTree, search);
    } else if (puzzleInfo.algorithm === 'Greedy' || puzzleInfo.algorithm === 'A* Tiles' || puzzleInfo.algorithm === 'A* Manhattan') {
        results = runHeuristicSearch(puzzleInfo, puzzleFunctions, solutionTree, search);
    } else {
        results = runSearch(puzzleInfo, puzzleFunctions, solutionTree, search, '');
    }
    // return results
    solution.solutionTree = results;
    solution.error = results === undefined ? "No Solution Found" : "";
    solution.queueMax = search.getMaxLength();
    console.log('returning results');
    return solution;
};