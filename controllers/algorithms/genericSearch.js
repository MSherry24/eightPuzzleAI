/**
 * Created by Mike on 1/10/2015.
 */
var breadth = require('./breadthFirst');
var depth = require('./depthFirst');


exports.run = function(inputObject, goal, algorithm) {
    var results, runData;
    results = {};
    console.log('generic Search Run');
    console.log('input object = ' + inputObject);
    console.log('goal  = ' + goal);
    console.log('algorithm  = ' + algorithm);
    if (algorithm === "Breadth") {
        console.log('run1');
        runData = runAlgorithm(JSON.stringify(inputObject), JSON.stringify(goal), breadth);
        console.log('run2');
        results.error = (results.info === 'no solution') ? { error: 'no solution found' } : '';
    }
    else if (algorithm === "Depth") {
        runData = runAlgorithm(JSON.stringify(inputObject), JSON.stringify(goal), depth);
        results.error = (results.info === 'no solution') ? { error: 'no solution found' } : '';
    }
    console.log('run3');
    results.info = runData.result;
    results.info.runTime = runData.runTime;
    return results;
}

var runAlgorithm = function (input, goal, algorithm) {
    "use strict";
    var startTime, endTime, result;
    startTime = new Date().getTime();
    result = algorithm.run(input, goal);
    endTime = new Date().getTime();
    return { result: result, runTime: (endTime - startTime) / 1000 };
};

var swap = function (currentNodeKey, zeroIndex, swapIndex) {
    "use strict";
    var newNode, currentNode;
    newNode = JSON.parse(currentNodeKey);
    currentNode = JSON.parse(currentNodeKey);
    newNode[zeroIndex] = currentNode[swapIndex];
    newNode[swapIndex] = currentNode[zeroIndex];
    return { nodeKey: JSON.stringify(newNode), zeroIndex: swapIndex };
};

exports.getFirstZeroIndex = function (inputObjectIndex) {
    "use strict";
    var inputObject = JSON.parse(inputObjectIndex);
    if (inputObject._1 === '0') { return '_1'; }
    if (inputObject._2 === '0') { return '_2'; }
    if (inputObject._3 === '0') { return '_3'; }
    if (inputObject._4 === '0') { return '_4'; }
    if (inputObject._5 === '0') { return '_5'; }
    if (inputObject._6 === '0') { return '_6'; }
    if (inputObject._7 === '0') { return '_7'; }
    if (inputObject._8 === '0') { return '_8'; }
    return '_9';
};

exports.getNextNodes = function (zeroIndex, currentNode) {
    "use strict";
    var upChild, downChild, rightChild, leftChild, nextNodes;
    if (zeroIndex === '_1') {
        rightChild = swap(currentNode, zeroIndex, '_2');
        downChild = swap(currentNode, zeroIndex, '_4');
    }
    if (zeroIndex === '_2') {
        leftChild = swap(currentNode, zeroIndex, '_1');
        rightChild = swap(currentNode, zeroIndex, '_3');
        downChild = swap(currentNode, zeroIndex, '_5');
    }
    if (zeroIndex === '_3') {
        leftChild = swap(currentNode, zeroIndex, '_2');
        downChild = swap(currentNode, zeroIndex, '_6');
    }
    if (zeroIndex === '_4') {
        upChild = swap(currentNode, zeroIndex, '_1');
        rightChild = swap(currentNode, zeroIndex, '_5');
        downChild = swap(currentNode, zeroIndex, '_7');
    }
    if (zeroIndex === '_5') {
        upChild = swap(currentNode, zeroIndex, '_2');
        leftChild = swap(currentNode, zeroIndex, '_6');
        rightChild = swap(currentNode, zeroIndex, '_4');
        downChild = swap(currentNode, zeroIndex, '_8');
    }
    if (zeroIndex === '_6') {
        upChild = swap(currentNode, zeroIndex, '_3');
        leftChild = swap(currentNode, zeroIndex, '_5');
        downChild = swap(currentNode, zeroIndex, '_9');
    }
    if (zeroIndex === '_7') {
        upChild = swap(currentNode, zeroIndex, '_4');
        rightChild = swap(currentNode, zeroIndex, '_8');
    }
    if (zeroIndex === '_8') {
        upChild = swap(currentNode, zeroIndex, '_5');
        leftChild = swap(currentNode, zeroIndex, '_7');
        rightChild = swap(currentNode, zeroIndex, '_9');
    }
    if (zeroIndex === '_9') {
        upChild = swap(currentNode, zeroIndex, '_6');
        leftChild = swap(currentNode, zeroIndex, '_8');
    }
    currentNode.upChild = upChild === null ? JSON.stringify(upChild) : '';
    currentNode.leftChild = leftChild === null ? JSON.stringify(leftChild) : '';
    currentNode.downChild = downChild === null ? JSON.stringify(downChild) : '';
    currentNode.rightChild = rightChild === null ? JSON.stringify(rightChild) : '';
    nextNodes = {};
    nextNodes.upChild = upChild;
    nextNodes.leftChild = leftChild;
    nextNodes.downChild = downChild;
    nextNodes.rightChild = rightChild;
    nextNodes.currentNode = currentNode;
    return nextNodes;
};

exports.getSolutionPath = function(solutionNode, solutionTree) {
    var solutionPath, currentNode;
    solutionPath = [];
    currentNode = solutionNode;
    solutionPath.push(solutionNode);
    while (solutionTree[currentNode].parent !== '') {
        currentNode = solutionTree[currentNode].parent;
        solutionPath.push(currentNode);
    };
    return solutionPath;
};

exports.addToSolutionTree = function (nodeToAdd, currentNode, solutionTree) {
    "use strict";
    solutionTree[nodeToAdd.nodeKey] = { upChild: '', leftChild: '',
        downChild: '', rightChild: '',
        parent: currentNode, zeroIndex: nodeToAdd.zeroIndex
    };
    return solutionTree;
};
