var queue = [];

exports.addNode = function (key) {
    queue.push(key);
    console.log('BFS - adding key ');
};

exports.getNextNode = function () {
    console.log('BFS - removing from queue');
    return queue.shift();
};