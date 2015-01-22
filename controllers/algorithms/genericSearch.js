var maxLength;
var queue = [];

exports.getQueue = function () { "use strict"; return queue; };
exports.setQueue = function (newQueue) { "use strict"; queue = newQueue; };
exports.getMaxLength = function () { "use strict"; return maxLength; };
exports.getNextNode = function () { "use strict"; return queue.shift(); };

exports.isEmpty = function () { "use strict"; return queue.length === 0; };

exports.clearQueue = function () {
    "use strict";
    queue = [];
    maxLength = 0;
};

var checkMax = function () {
    "use strict";
    maxLength = maxLength === undefined ? 0 : maxLength;
    maxLength = queue.length > maxLength ? queue.length : maxLength;
};

exports.addNode = function (key) {
    "use strict";
    queue.push(key);
    checkMax();
};