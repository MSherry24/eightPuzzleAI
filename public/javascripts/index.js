/**
 * Created by mikesherry24 on 1/9/15.
 */
var states, currentState, runNumber;

var setState = function () {
    "use strict";
    // Sets the numbers that appear in the "State" section of the index page
    if (currentState !== null) {
        $('#stateBox1').html(JSON.parse(states[currentState].node)._1);
        $('#stateBox2').html(JSON.parse(states[currentState].node)._2);
        $('#stateBox3').html(JSON.parse(states[currentState].node)._3);
        $('#stateBox4').html(JSON.parse(states[currentState].node)._4);
        $('#stateBox5').html(JSON.parse(states[currentState].node)._5);
        $('#stateBox6').html(JSON.parse(states[currentState].node)._6);
        $('#stateBox7').html(JSON.parse(states[currentState].node)._7);
        $('#stateBox8').html(JSON.parse(states[currentState].node)._8);
        $('#stateBox9').html(JSON.parse(states[currentState].node)._9);
    }
};

var setInput = function () {
    "use strict";
    // Sets the numbers that appear under the Input section of the index page
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

    // If the user wants to use a custom input, hide the standard input display and show a grid of text
    // inputs.  Otherwise, show the standard input and hide the custom input fields.
    $('#customProblem').is(':checked') ? $('#customInputContainer').show() : $('#customInputContainer').hide();
    !$('#customProblem').is(':checked') ? $('#standardInputContainer').show() : $('#standardInputContainer').hide();

    // If custom display is not selected and the user has selected one of the input buttons, change the
    // numbers that appear in the display grid so that they match the selected input.
    if (inputSelected !== undefined && !$('#customProblem').is(':checked')) {
        $('#inputBox1').html(inputSelected._1);
        $('#inputBox2').html(inputSelected._2);
        $('#inputBox3').html(inputSelected._3);
        $('#inputBox4').html(inputSelected._4);
        $('#inputBox5').html(inputSelected._5);
        $('#inputBox6').html(inputSelected._6);
        $('#inputBox7').html(inputSelected._7);
        $('#inputBox8').html(inputSelected._8);
        $('#inputBox9').html(inputSelected._9);
        // Also, set the values in the customInput boxes to the selected input, since the custom input
        // values will always be used to send the input to the server.
        $('#customInputBox1').val(inputSelected._1);
        $('#customInputBox2').val(inputSelected._2);
        $('#customInputBox3').val(inputSelected._3);
        $('#customInputBox4').val(inputSelected._4);
        $('#customInputBox5').val(inputSelected._5);
        $('#customInputBox6').val(inputSelected._6);
        $('#customInputBox7').val(inputSelected._7);
        $('#customInputBox8').val(inputSelected._8);
        $('#customInputBox9').val(inputSelected._9);
    }
};

var showFirstState = function () {
    "use strict";
    // Used by the State portion of the page to show the initial configuration in a puzzle solution.
    currentState = 0;
    setState();
};

var showFinalState = function () {
    "use strict";
    // Used by the State portion of the page to show the final configuration in a puzzle solution.
    currentState = states.length - 1;
    setState();
};

var showPreviousState = function () {
    "use strict";
    // Used by the State portion of the page to show the previous configuration in a puzzle solution.
    if (currentState !== 0 && states.length !== 0) {
        currentState = currentState - 1;
        setState();
    }
};

var showNextState = function () {
    "use strict";
    // Used by the State portion of the page to show the next configuration in a puzzle solution.
    if (currentState !== states.length - 1 && states.length !== 0) {
        currentState = currentState + 1;
        setState();
    }
};

var postToRunRoute = function () {
    "use strict";
    // Called when the user clicks the "Solve Puzzle" button.  This function
    // parses out all of the user's selections, packages them into a JSON object
    // and passes a stringified version of that object to the app server.
    var algorithmVal, inputVal, goal,
        customInput1, customInput2, customInput3,
        customInput4, customInput5, customInput6,
        customInput7, customInput8, customInput9,
        customInput;
    // Hides the submit button while the app is processing a puzzle so that multiple requests
    // are not sent.  The application can actually handle multiple requests, but the animation that
    // appears lets the user know that the server is working on the problem and prevents the user from
    // erasing a problem solution from the state stepper before they examine the results.
    $('#submitButton').hide();
    $('#loadingContainer').show();
    // Parse out the user's UI selections
    algorithmVal = $('input[name=algorithm]:checked').closest('label').text();
    //inputVal = $('input[name=options]:checked').closest('label').text();
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
    goal = { _1:'1',
             _2:'2',
             _3:'3',
             _4:'8',
             _5:'0',
             _6:'4',
             _7:'7',
             _8:'6',
             _9:'5' };
    // Post the information to the server
    $.post("/run", {
            puzzleType: 'eightPuzzle',
            algorithm: algorithmVal,
            input: JSON.stringify(customInput),
            goal: JSON.stringify(goal)},
        function (data) {
            // "data" is the result returned by the server.  Results found in "data" are parsed and displayed
            // at the bottom of the UI window

            var runInfo = "Run # " + runNumber + " results:"
                            + "<br>";
            var results = JSON.parse(data);
                runInfo += "Input: " + makeInputPretty(results.input)
                + " -- Algorithm: " + results.algorithm
                + "<br>"
                + "Nodes Created: " + results.nodesCreated
                + "<br>"
                + "Nodes Visited: " + results.nodesVisited
                + "<br>"
                + "Max Queue Length: " + results.queueMax
                + "<br>"
                + "Steps in Solution: " + results.solutionPath.length
                + "<br>"
                + "Total Running Time: " + results.runTime + " seconds"
                + "<br>";
            if (results.error === "" || results.error === undefined) {
                states = results.solutionPath.reverse();
                currentState = states.length - 1;
                showFirstState();
                printSolutionSteps();
            } else {
                runInfo += 'Error during analysis.  Error message - '
                        + results.error
                        + '<br>';
            }
            runInfo += '<br>';
            $("#output").prepend(runInfo);
            // Increment run number so that the next puzzle sent will have a different ID in the output window
            runNumber++;
            // Show the submit button and hide the running animation now that the server is ready
            $('#submitButton').show();
            $('#loadingContainer').hide();
        });
};

var makeInputPretty = function(input) {
    var prettyInput, range, inputObject;
    prettyInput = '';
    inputObject = JSON.parse(input);
    range = Array.apply(undefined, Array(9)).map(function (_, i) {return i + 1;});
    range.map(function(e) {
        var index = '_' + e.toString();
        prettyInput += inputObject[index] + ' ';
    });
    return prettyInput;
};

var setAlgorithmText = function() {
    var algorithmVal;
    algorithmVal = $('input[name=algorithm]:checked').closest('label').text();
    alrorithmText = '';
    switch(algorithmVal) {
        case 'Breadth':
            $('#AlgorithmName').html('Breadth First Search');
            break;
        case 'Depth':
            $('#AlgorithmName').html('Depth First Search');
            break;
        case 'Iterative':
            $('#AlgorithmName').html('Iterative Depth First Search');
            break;
    }
};

var printSolutionSteps = function() {
    var steps;
    steps = '';
    states.forEach(function(step) {
        steps += step.whatChild;
        steps += ' ';
    })
    $('#outputTrace').html(steps);
};

$(document).ready(function() {
    // Initialize button functions and global variables.
    $('#submitButton').on('click', postToRunRoute);
    $('#nextState').on('click', showNextState);
    $('#prevState').on('click', showPreviousState);
    $('#firstState').on('click', showFirstState);
    $('#lastState').on('click', showFinalState);
    $('#inputRadioButtons').on('change', setInput);
    $('#algBtnGroup').on('change', setAlgorithmText);
    $('#submitButton').show();
    $('#loadingContainer').hide();
    states = [];
    currentState = 0;
    runNumber = 1;
    setInput();
    setAlgorithmText();
});