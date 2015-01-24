/*
 *=======================================================================
 * depthFirstSearch
 * This library contains all the functions and objects required to run a DFS
 * Except where noted, it uses all of the same functions as genericSearch
 *=======================================================================
 */
var genericSearch = require('./genericSearch');

exports.getMaxLength = genericSearch.getMaxLength;
exports.clearQueue = genericSearch.clearQueue;
exports.isEmpty = genericSearch.isEmpty;
exports.addNode = genericSearch.addNode;

/*
 *=======================================================================
 * getNextNode
 * returns the result of queue.pop() instead of queue.shift() which is what generic search uses
 * This ultimately represents the difference between first in, first out behavior and first in,
 * last out behavior, which is the difference between a depth and a breadth first search.
 *=======================================================================
 */
exports.getNextNode = function () {
    "use strict";
    var queue, result;
    queue = genericSearch.getQueue();
    result = (queue.length > 0) ? queue.pop() : undefined;
    genericSearch.setQueue(queue);
    return result;
};



