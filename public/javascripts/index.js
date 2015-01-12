/**
 * Created by mikesherry24 on 1/9/15.
 */
var states, currentState;

var setState = function () {
    "use strict";
    if (currentState !== null) {
        $('#stateBox1').html(states[currentState]._1);
        $('#stateBox2').html(states[currentState]._2);
        $('#stateBox3').html(states[currentState]._3);
        $('#stateBox4').html(states[currentState]._4);
        $('#stateBox5').html(states[currentState]._5);
        $('#stateBox6').html(states[currentState]._6);
        $('#stateBox7').html(states[currentState]._7);
        $('#stateBox8').html(states[currentState]._8);
        $('#stateBox9').html(states[currentState]._9);
    }
};

var showFinalState = function () {
    "use strict";
    currentState = states.length - 1;
    setState();
};

var showPreviousState = function () {
    "use strict";
    if (currentState !== 0 && states.length !== 0) {
        currentState = currentState - 1;
        setState();
    }
};

var showNextState = function () {
    "use strict";
    if (currentState !== states.length - 1 && states.length !== 0) {
        currentState = currentState + 1;
        setState();
    }
};

var postToRunRoute = function () {
    "use strict";
    var algorithmVal, inputVal, totalState,
        stateBox1, stateBox2, stateBox3,
        stateBox4, stateBox5, stateBox6,
        stateBox7, stateBox8, stateBox9;
    algorithmVal = $('input[name=algorithm]:checked').closest('label').text();
    inputVal = $('input[name=options]:checked').closest('label').text();
    stateBox1 = $('#stateBox1').text();
    stateBox2 = $('#stateBox2').text();
    stateBox3 = $('#stateBox3').text();
    stateBox4 = $('#stateBox4').text();
    stateBox5 = $('#stateBox5').text();
    stateBox6 = $('#stateBox6').text();
    stateBox7 = $('#stateBox7').text();
    stateBox8 = $('#stateBox8').text();
    stateBox9 = $('#stateBox9').text();
    totalState = '{1:' + stateBox1 +
        ',2:' + stateBox2 +
        ',3:' + stateBox3 +
        ',4:' + stateBox4 +
        ',5:' + stateBox5 +
        ',6:' + stateBox6 +
        ',7:' + stateBox7 +
        ',8:' + stateBox8 +
        ',9:' + stateBox9 + '}';
    $.post("/run", {algorithm: algorithmVal, input: inputVal, totalState: totalState},
        function (data) {
            var blob = JSON.parse(data);
            console.log('blob.name = ' + blob.name);
            $("#output").prepend("Data Loaded: " + data + '<br>');
            states = JSON.parse(blob.states);
            currentState = states.length - 1;
            showFinalState();
        });
};

$(document).ready(function() {
    $('#submitButton').on('click', postToRunRoute);
    $('#nextState').on('click', showNextState);
    $('#prevState').on('click', showPreviousState);
    states = [];
    currentState = 0;
});