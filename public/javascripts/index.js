/**
 * Created by mikesherry24 on 1/9/15.
 */
var states, currentState, runNumber;

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

var setInput = function () {
    "use strict";
    var easyInput, mediumInput, hardInput, inputSelected;
    easyInput = {_1: '1', _2: '3', _3: '4', _4: '8', _5: '6', _6: '2', _7: '7', _8: '0', _9: '5'};
    mediumInput = {_1: '2', _2: '8', _3: '1', _4: '0', _5: '4', _6: '3', _7: '7', _8: '6', _9: '5'};
    hardInput = {_1: '5', _2: '6', _3: '7', _4: '4', _5: '0', _6: '8', _7: '3', _8: '2', _9: '1'};
    if ($('#easyProblem').is(':checked')) {
        inputSelected = easyInput;
    } else if ($('#mediumProblem').is(':checked')) {
        inputSelected = mediumInput;
    } else if ($('#hardProblem').is(':checked')) {
        inputSelected = hardInput;
    }

    $('#customProblem').is(':checked') ? $('#customInputContainer').show() : $('#customInputContainer').hide();
    !$('#customProblem').is(':checked') ? $('#standardInputContainer').show() : $('#standardInputContainer').hide();

    if (inputSelected !== undefined && !$('#hardProblem').is(':checked')) {
        $('#inputBox1').html(inputSelected._1);
        $('#inputBox2').html(inputSelected._2);
        $('#inputBox3').html(inputSelected._3);
        $('#inputBox4').html(inputSelected._4);
        $('#inputBox5').html(inputSelected._5);
        $('#inputBox6').html(inputSelected._6);
        $('#inputBox7').html(inputSelected._7);
        $('#inputBox8').html(inputSelected._8);
        $('#inputBox9').html(inputSelected._9);
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
        customInput1, customInput2, customInput3,
        customInput4, customInput5, customInput6,
        customInput7, customInput8, customInput9,
        customInput;
    algorithmVal = $('input[name=algorithm]:checked').closest('label').text();
    inputVal = $('input[name=options]:checked').closest('label').text();
    customInput1 = $('#customInputBox1').val();
    customInput2 = $('#customInputBox2').val();
    customInput3 = $('#customInputBox3').val();
    customInput4 = $('#customInputBox4').val();
    customInput5 = $('#customInputBox5').val();
    customInput6 = $('#customInputBox6').val();
    customInput7 = $('#customInputBox7').val();
    customInput8 = $('#customInputBox8').val();
    customInput9 = $('#customInputBox9').val();
    customInput = { _1:customInput1.toString(),
                    _2:customInput2.toString(),
                    _3:customInput3.toString(),
                    _4:customInput4.toString(),
                    _5:customInput5.toString(),
                    _6:customInput6.toString(),
                    _7:customInput7.toString(),
                    _8:customInput8.toString(),
                    _9:customInput9.toString() };
    console.log('custom input = ' + customInput);
    $.post("/run", {algorithm: algorithmVal, input: inputVal, customInput: JSON.stringify(customInput)},
        function (data) {
            var runInfo = "Run # " + runNumber + " results:"
                            + "<br>";
            var results = JSON.parse(data);

            if (results.error === '' || results.error === undefined) {
                runInfo += "Input: " + results.input
                + " -- Algorithm: " + results.algorithm
                + "<br>"
                + "Nodes Created: " + results.nodesCreated
                + "<br>"
                + "Nodes Examined: " + results.nodesExamined
                + "<br><br>";
                states = results.solutionPath.map(JSON.parse).reverse();
                currentState = states.length - 1;
                showFinalState();
            } else {
                runInfo += results.error;
            }
            $("#output").prepend(runInfo);
            runNumber++;
        });
};

$(document).ready(function() {
    $('#submitButton').on('click', postToRunRoute);
    $('#nextState').on('click', showNextState);
    $('#prevState').on('click', showPreviousState);
    $('#inputRadioButtons').on('change', setInput);
    states = [];
    currentState = 0;
    runNumber = 1;
    setInput();
});