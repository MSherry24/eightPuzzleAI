var queue = [];

exports.addNode = function (key) {
    queue.push(key);
    console.log('DFS - adding key');
};

exports.getNextNode = function () {
    console.log('DFS - removing from queue');
    return queue.pop();
};

exports.clearQueue = function() {
    queue = [];
};