/**
 * Created by MSherry on 1/21/2015.
 */

exports.evaluate = function (key) {
    var keyObject, score, indexMap, idealIndex;
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
    keyObject= JSON.parse(key);
    for (var key in keyObject) {
        var currentLocation, idealLocation;
        if(keyObject[key] !== '0') {
            currentLocation = indexMap[key];
            idealLocation = indexMap[idealIndex[keyObject[key]]];
            score += (Math.abs(currentLocation[0] - idealLocation[0])
            + Math.abs(currentLocation[1] - idealLocation[1]));
        }
    }
    return score;
};