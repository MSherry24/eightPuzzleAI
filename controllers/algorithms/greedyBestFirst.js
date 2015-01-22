var genericSearch = require('./genericSearch');
var globalSolutionTree;

var getSolutionTree = function () { "use strict"; return globalSolutionTree; };
var setSolutionTree = function (x) { "use strict"; globalSolutionTree = x; };
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
exports.getNextNode = function (solutionTree) {
    "use strict";
    var queue, returnKey;
    setSolutionTree(solutionTree);
    queue = genericSearch.getQueue();
    queue.sort(comparator);
    returnKey = queue.shift();
    genericSearch.setQueue(queue);
    return returnKey;
};

