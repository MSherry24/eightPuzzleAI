var breadth = require('./breadthFirst');
var maxLength;

exports.getMaxLength = function () { "use strict"; return breadth.getMaxLength(); };
exports.addNode = function (key) { "use strict"; breadth.addNode(key); };
exports.clearQueue = function () { "use strict"; breadth.clearQueue(); };
exports.isEmpty = function () { "use strict"; breadth.isEmpty(); };

exports.getNextNode = function () {
    "use strict";
    var queue, result;
    queue = breadth.getQueue();
    result = (queue.length > 0) ? queue.pop() : undefined;
    breadth.setQueue(queue);
    return result;
};




