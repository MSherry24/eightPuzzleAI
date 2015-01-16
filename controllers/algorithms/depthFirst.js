var queue = [];

exports.addNode = function (key) {
    queue.push(key);
    //console.log('DFS - adding key');
};

exports.getNextNode = function () {
    //console.log('DFS - removing from queue');
    if (queue.length > 0) { return queue.pop(); }
    else                  { return undefined; }
};

exports.clearQueue = function() {
    queue = [];
};