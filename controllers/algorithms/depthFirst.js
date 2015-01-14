var stack = [];

exports.addNode = function (key) {
    stack.push(key);
    console.log('DFS - adding key');
};

exports.getNextNode = function () {
    console.log('DFS - removing from stack');
    return stack.pop();
};