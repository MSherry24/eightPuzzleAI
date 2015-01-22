exports.evaluate = function (key) {
    var keyObject, score;
    score = 0;
    keyObject = JSON.parse(key);
    if (keyObject._1 !== '1' && keyObject._1 !== '0') { score ++; }
    if (keyObject._2 !== '2' && keyObject._2 !== '0') { score ++; }
    if (keyObject._3 !== '3' && keyObject._3 !== '0') { score ++; }
    if (keyObject._4 !== '8' && keyObject._4 !== '0') { score ++; }
    if (keyObject._5 !== '0') { score ++; }
    if (keyObject._6 !== '4' && keyObject._6 !== '0') { score ++; }
    if (keyObject._7 !== '7' && keyObject._7 !== '0') { score ++; }
    if (keyObject._8 !== '6' && keyObject._8 !== '0') { score ++; }
    if (keyObject._9 !== '5' && keyObject._9 !== '0') { score ++; }
    return score;
};