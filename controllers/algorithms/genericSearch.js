/*
 *=======================================================================
 * genericSearch
 * This library contains all the functions and objects required to run a search
 * algorithm.  It is referenced by all other search algorithm libraries which
 * directly reuse the functions here for the most part.  See individual search files
 * for any changes
 *=======================================================================
 */

// maxLength stores the maximum length of the queue for any single search
var maxLength;

// queue is used to store keys that are to be tested by the search algorithm
var queue = [];

/*
 *=======================================================================
 * getQueue
 * Input: None
 * Output: returns queue in its current state
 *=======================================================================
 */
exports.getQueue = function () { "use strict"; return queue; };

/*
 *=======================================================================
 * setQueue
 * Input: an array
 * Output: none
 * Action: replaces the value of queue with the array that is passed in as an argument
 *=======================================================================
 */
exports.setQueue = function (newQueue) { "use strict"; queue = newQueue; };

/*
 *=======================================================================
 * getMaxLength
 * Input: None
 * Output: returns teh value of maxLength
 *=======================================================================
 */
exports.getMaxLength = function () { "use strict"; return maxLength; };

/*
 *=======================================================================
 * getNextNode
 * Input: None
 * Output: returns the last value input into queue
 *=======================================================================
 */
exports.getNextNode = function () { "use strict"; return queue.shift(); };

/*
 *=======================================================================
 * getNextNode
 * Input: None
 * Output (Boolean): if the queue is empty, returns true, otherwise returns false
 *=======================================================================
 */
exports.isEmpty = function () { "use strict"; return queue.length === 0; };

/*
 *=======================================================================
 * clearQueue
 * Input: None
 * Output: None
 * Actions: sets queue to an empty array, sets maxLength to zero
 *=======================================================================
 */
exports.clearQueue = function () {
    "use strict";
    queue = [];
    maxLength = 0;
};

/*
 *=======================================================================
 * checkMax (private)
 * Input: None
 * Output: None
 * Actions: If the current length of the queue is greater than maxLegth,
 *          sets maxLegth to the current length
 *=======================================================================
 */
var checkMax = function () {
    "use strict";
    maxLength = maxLength === undefined ? 0 : maxLength;
    maxLength = queue.length > maxLength ? queue.length : maxLength;
};

/*
 *=======================================================================
 * addNode
 * Input (String): A JSON stringified version of a puzzle state
 * Output: None
 * Actions: Adds the input key to queue.  Calls checkMax().
 *=======================================================================
 */
exports.addNode = function (key) {
    "use strict";
    queue.push(key);
    checkMax();
};