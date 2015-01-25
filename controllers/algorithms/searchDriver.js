var breadth = require('./breadthFirst');
var depth = require('./depthFirst');
var greedy = require('./greedyBestFirst');
var aStar = require('./aStar');

/*
 *=======================================================================
 * getSearch()
 * Input: algortihm (String) - Passed in by the UI, represents the algorithm chosen
 * Output: Object - An object containing all of the search functions required
 *                  to run the chosen algorith.  These libraries are found
 *                  in the controllers/algorithms folder.
 *=======================================================================
 */
var getSearch = function (algorithm) {
    "use strict";
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

/*
 *=======================================================================
 * runSearch()
 * Input:
 * puzzleInfo (object) -
 *      Fields {
 *          input (String): Passed in by the UI, a stringified JSON object representing a single puzzle state
 *          goal (String: Passed in by the UI, a stringified JSON object representing the goal state
 *          rootNode (Object): The node representing the user's input
 *      }
 * puzzleFunctions (Object) -
 *     Fields {
 *          successorFunction (Function) - Takes a key and the solutionTree as an input and returns an array
 *                                         containing all of the child node objects.
 *          addToSolutionTree (Function) - Takes a key, a node, the solution tree, and a heuristic function as an input
 *                                         returns the solution tree with the new key added in.
 *          evaluateHeuristic (Function) - A function containing a method evaluate() that will calculate the heuristic score
 *                                         of a key
 *    }
 * solutionTree (Object) - An object that is essentially a hash map where the key is a stringified representation of a puzzle state
 *                         and the value is an object containing all relevant data about that state (parent, children, heuristic scores, etc.)
 *                         (see the comments in eightPuzzle about the structure of a node.
 * search (Object) - A library of functions used to run a particular search algorithm. See getSearch() and the search algorithm files
 *                   for more detailed information.
 * maxDepth (Number/String) - If this value is a number, an iterative deepening search is being run.  Otherwise it will be
 *                            an empty string.  If it is a number, runSearch will not examine any nodes with a depth greater
 *                            than maxDepth
 * Output: Object - If a solution is found, the output will be the solution tree in its final state.  If no solution is found
 *                  iterative deepening is being run, and the max depth for that iteration was reached, false will be returned
 *                  as a flag to runIterativeDeepening signifying that another iteration can be run.  Otherwise, undefined is
 *                  returned indicating that no solution is possible for this particular input.
 *=======================================================================
 */
var runSearch = function (puzzleInfo, puzzleFunctions, solutionTree, search, maxDepth) {
    "use strict";
    var currentKey, nextNodes, currentDepth, maxDepthNotReached, isIterativeDeepening, isNotIterativeDeepening;
    isNotIterativeDeepening = maxDepth === '';
    isIterativeDeepening = !isNotIterativeDeepening;
    maxDepthNotReached = true;
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
                    || (isIterativeDeepening && solutionTree[node.key].depth > currentDepth))) {
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
        if (isIterativeDeepening && maxDepthNotReached && currentDepth === maxDepth) {
            maxDepthNotReached = false;
        }
        // Get the next node from the queue
        currentKey = search.getNextNode(solutionTree);
        currentDepth = solutionTree[currentKey] === undefined ? currentDepth : solutionTree[currentKey].depth;
    }
    // If the goal state was found, return the solution tree and the information about nodes created/visited
    if (currentKey === puzzleInfo.goal) { return solutionTree; }
    // If max depth is not reached before the queue empties all reachable states were checked before
    // the max depth was reached, so another round of iterative deepening will also not find a solution.
    // Therefore, no solution is possible.
    if (search.isEmpty() && maxDepthNotReached) { return undefined; }
    // Otherwise, another round of iterative deepening is required.  False is returned instead of a solution tree
    // as a signal to runIterativeDeepening that it should run another iteration.
    return false;
};

/*
 *=======================================================================
 * runIterativeDeepening()
 * Input:
 * puzzleInfo (object) -
 *      Fields {
 *          input (String): Passed in by the UI, a stringified JSON object representing a single puzzle state
 *          goal (String: Passed in by the UI, a stringified JSON object representing the goal state
 *      }
 * puzzleFunctions (Object) -
 *     Fields {
 *          successorFunction (Function) - Takes a key and the solutionTree as an input and returns an array
 *                                         containing all of the child node objects.
 *          addToSolutionTree (Function) - Takes a key, a node, the solution tree, and a heuristic function as an input
 *                                         returns the solution tree with the new key added in.
 *          evaluateHeuristic (Function) - A function containing a method evaluate() that will calculate the heuristic score
 *                                         of a key
 *    }
 * solutionTree (Object) - An object that is essentially a hash map where the key is a stringified representation of a puzzle state
 *                         and the value is an object containing all relevant data about that state (parent, children, heuristic scores, etc.)
 *                         (see the comments in eightPuzzle about the structure of a node.
 * search (Object) - A library of functions used to run a particular search algorithm. See getSearch() and the search algorithm files
 *                   for more detailed information.
 * Output: Object - Simply passes along the results of runSearch.  It will be the final state of the solution tree if a
 *                  solution is found, otherwise it will be undefined.
 *=======================================================================
 */
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

/*
 *=======================================================================
 * runHeuristicSearch()
 * Input:
 * puzzleInfo (object) -
 *      Fields {
 *          input (String): Passed in by the UI, a stringified JSON object representing a single puzzle state
 *          goal (String: Passed in by the UI, a stringified JSON object representing the goal state
 *      }
 * puzzleFunctions (Object) -
 *     Fields {
 *          successorFunction (Function) - Takes a key and the solutionTree as an input and returns an array
 *                                         containing all of the child node objects.
 *          addToSolutionTree (Function) - Takes a key, a node, the solution tree, and a heuristic function as an input
 *                                         returns the solution tree with the new key added in.
 *          evaluateHeuristic (Function) - A function containing a method evaluate() that will calculate the heuristic score
 *                                         of a key
 *    }
 * solutionTree (Object) - An object that is essentially a hash map where the key is a stringified representation of a puzzle state
 *                         and the value is an object containing all relevant data about that state (parent, children, heuristic scores, etc.)
 *                         (see the comments in eightPuzzle about the structure of a node.
 * search (Object) - A library of functions used to run a particular search algorithm. See getSearch() and the search algorithm files
 *                   for more detailed information.
 * Output: Object - Will be the final state of the solution tree if a solution is found, otherwise it will be undefined.
 *=======================================================================
 */
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
        // Get the next node from the search algorithm library and update the current depth.
        currentKey = search.getNextNode(solutionTree);
        currentDepth = solutionTree[currentKey] === undefined ? currentDepth : solutionTree[currentKey].depth;
        // if a solution state is found, save its current depth and then continue running the algorithm to see if
        // a more efficient solution can be found.
        if (currentKey === puzzleInfo.goal) {
            bestSolutionDepth = currentDepth < bestSolutionDepth ? currentDepth : bestSolutionDepth;
        }
    }
    // If the goal state was found, return the solution tree and the information about nodes created/visited
    if (bestSolutionDepth !== Infinity) {
        return solutionTree;
    }
    return undefined;
};

/*
 *=======================================================================
 * run()
 * Input:
 * puzzleInfo (object) -
 *      Fields {
 *          input (String): Passed in by the UI, a stringified JSON object representing a single puzzle state
 *          goal (String: Passed in by the UI, a stringified JSON object representing the goal state
 *      }
 * puzzleFunctions (Object) -
 *     Fields {
 *          successorFunction (Function) - Takes a key and the solutionTree as an input and returns an array
 *                                         containing all of the child node objects.
 *          addToSolutionTree (Function) - Takes a key, a node, the solution tree, and a heuristic function as an input
 *                                         returns the solution tree with the new key added in.
 *          evaluateHeuristic (Function) - A function containing a method evaluate() that will calculate the heuristic score
 *                                         of a key
 *    }
 * Output: Object - Will be the final state of the solution tree if a solution is found, otherwise it will be undefined.
 *=======================================================================
 */
exports.run = function (puzzleInfo, puzzleFunctions) {
    "use strict";
    var solutionTree, search, results, solution;
    // initialize variables
    solutionTree = {};
    results = {};
    solution = {};
    solutionTree[puzzleInfo.input] = puzzleInfo.rootNode;
    // Find correct search algorithm library
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
    // if the results of the search are undefined, no solution is possible.  Add a message to solution.error that can
    // be displayed to the user.
    solution.error = results === undefined ? "No Solution Found" : "";
    // Get the maximum length of the queue during the search so that it can be returned to the user.
    solution.queueMax = search.getMaxLength();
    return solution;
};