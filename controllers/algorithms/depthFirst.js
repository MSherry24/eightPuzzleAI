var genericSearch = require('./genericSearch');

exports.getQueue = genericSearch.getQueue;
exports.setQueue = genericSearch.setQueue;
exports.getMaxLength = genericSearch.getMaxLength;
exports.clearQueue = genericSearch.clearQueue;
exports.isEmpty = genericSearch.isEmpty;
exports.addNode = genericSearch.addNode;

exports.getNextNode = function () {
    "use strict";
    var queue, result;
    queue = genericSearch.getQueue();
    result = (queue.length > 0) ? queue.pop() : undefined;
    genericSearch.setQueue(queue);
    return result;
};



