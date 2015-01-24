/*
 *=======================================================================
 * manhattanDistance
 * This library contains one function, evaluate() which calculates the manhattan
 * distance between each tile and its goal position, sums them, and returns the total.
 *=======================================================================
 */

exports.evaluate = function (key) {
    var keyObject, score, indexMap, idealIndex, e;
    // indexMap maps each key in a puzzle board to its x/y coordinates
    indexMap = {
        _1: [2, 0],
        _2: [2, 1],
        _3: [2, 2],
        _4: [1, 0],
        _5: [1, 1],
        _6: [1, 2],
        _7: [0, 0],
        _8: [0, 1],
        _9: [0, 2]
    };
    // idealIndex maps each tile value to its goal index
    idealIndex = {
        1:'_1',
        2:'_2',
        3:'_3',
        4:'_6',
        5:'_9',
        6:'_8',
        7:'_7',
        8:'_4'
    };
    score = 0;
    keyObject = JSON.parse(key);
    for (e in keyObject) {
        var currentLocation, idealLocation;
        // Check to see if the current value is 0, and if so, do not calculate a manhattan distance, since the empty
        // square doesn't count for this heuristic function.
        if (keyObject[e] !== '0') {
            // get the x/y coordinates for the current tile
            currentLocation = indexMap[e];
            // find the x/y coordinates for this tile's goal state
            idealLocation = indexMap[idealIndex[keyObject[e]]];
            // calculate the manhattan distance and add it to the total sum
            score += (Math.abs(currentLocation[0] - idealLocation[0])
            + Math.abs(currentLocation[1] - idealLocation[1]));
        }
    }
    return score;
};