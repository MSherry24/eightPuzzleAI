/*
 *=======================================================================
 * greedyBestFirst
 * This library contains all the functions and objects required to run a greedy best first
 * search algorithm.  Except where noted, it uses all of the same functions as genericSearch
 *=======================================================================
 */

var genericSearch = require('./genericSearch');

// globalSolutionTree(object) is a temporary placeholder for the solution tree which is passed in
// in the addNode() function.
var globalSolutionTree;

/*
 *=======================================================================
 * getSolutionTree()
 * Input: None
 * Output: Object - globalSolutionTree
 *=======================================================================
 */
var getSolutionTree = function () { "use strict"; return globalSolutionTree; };

/*
 *=======================================================================
 * setSolutionTree()
 * Input (object): a solution tree object
 * Output: None
 * Action: Sets global solution tree to the object passed in as an argument
 *=======================================================================
 */
var setSolutionTree = function (x) { "use strict"; globalSolutionTree = x; };

/*
 *=======================================================================
 * comparator()
 * Input (string, string): both inputs are stringified JSON keys
 * Output (number): if the heuristic score [h(n)] for a is less than the heuristic score for b, returns -1
 *                  if the heuristic score [h(n)] for a is greater than the heuristic score for b, returns 1
 *                  otherwise returns 0
 * This function is used by Array.sort() as an argument in order to properly sort all of the keys in queue
 *=======================================================================
 */
var comparator = function (a, b) {
    "use strict";
    var tempSolutionTree = getSolutionTree();
    if (tempSolutionTree[a].hnScore < tempSolutionTree[b].hnScore) { return -1; }
    if (tempSolutionTree[a].hnScore > tempSolutionTree[b].hnScore) { return 1; }
    return 0;
};

exports.getMaxLength = genericSearch.getMaxLength;
exports.getNextNode = genericSearch.getNextNode;
exports.clearQueue = genericSearch.clearQueue;
exports.isEmpty = genericSearch.isEmpty;
exports.addNode = genericSearch.addNode;

/*
 *=======================================================================
 * getNextNode()
 * Input (Object): a solution tree
 * Output (String): a JSON stringified key
 *=======================================================================
 */
exports.getNextNode = function (solutionTree) {
    "use strict";
    var queue, returnKey;
    // sets the internal solution tree to the solution tree passed in as an argument
    setSolutionTree(solutionTree);
    // gets the current queue from genericSearch
    queue = genericSearch.getQueue();
    // sorts all of the keys in queue
    queue.sort(comparator);
    // gets the highest priority key from queue
    returnKey = queue.shift();
    // returns queue to genericSearch
    genericSearch.setQueue(queue);
    // returns the highest priority key
    return returnKey;
};

