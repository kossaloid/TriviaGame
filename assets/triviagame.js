
$(document).ready(function () {

    //Set event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.triviaStart);
    $(document).on('click', '.option', trivia.guessChecker);

    })
    //Sets variable
    var trivia = {
    //Set trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',
    //Set questions, options, and answers
    questions: {
        q1: 'Who is the underlying antagonist in all parts of Jojos Bizarre Adventure?',
        q2: 'Who does the author Hirohiko Araki love but is hated by all true Jojo fans?',
        q3: 'Who is the main Joestar in Part 4: Diamond is Unbreakable?',
        q4: 'Which Jojo villain stand erases time?'
    },
    options: {
        q1: ['Yoshikage Kira', 'Dio Brando', 'Kars', 'Diavolo'],
        q2: ['Jotaro Kujo', 'Kishibe Rohan', 'Johnny Joestar', 'Okuyasu Nijimura'],
        q3: ['Jolyne Kujo', 'Jonathan Joestar', 'Josuke Higashikata', 'Joseph Joestar'],
        q4: ['King Crimson', 'The World', 'Killer Queen', 'Dirty Deeds Done Dirt Cheap']
    },
    answers: {
        q1: 'Dio Brando',
        q2: 'Kishibe Rohan',
        q3: 'Josuke Higashikata',
        q4: 'King Crimson'
    },

    //Trivia method to start game
    triviaStart: function () {
        //Variable.property
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);

        //Show game
        $('#game').show();
        //Empty results
        $('#results').html('');
        //Show timer via text
        $('#timer').text(trivia.timer);
        //Hide start button once game starts
        $('#start').hide();
        //Shows remaining time once game starts
        $('#remaining-time').show();
        //Ask questions
        trivia.nextQuestion();
    },

    //Method to loop through and display questions and options 
    nextQuestion: function () {

        //Set timer to 20 seconds each question
        trivia.timer = 20;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);

        //To prevent timer speed up (Keep 1000!)
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }

        //Gets all the questions then indexes the current questions
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);

        //An array of all the user options for the current question
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];

        //Appends to button class in html
        $.each(questionOptions, function (index, key) {
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })

    },
    //Method to decrement counter and count unanswered if timer runs out
    timerRunning: function () {
        //If timer still has time left and there are still questions left to ask
        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('#timer').addClass('last-seconds');
            }
        }
        //If the time has run out and unanswered show 'Out of time'
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>OH MY GOD! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
        }
        //Array of questions complete, shows the score!
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {
            $('#results')
                .html('<h3>Araki would be proud!</h3>' +
                    '<p>Correct: ' + trivia.correct + '</p>' +
                    '<p>Incorrect: ' + trivia.incorrect + '</p>' +
                    '<p>Unaswered: ' + trivia.unanswered + '</p>' +
                    '<p>Please play again!</p>');

            //Hides game until event click
            $('#game').hide();

            //Shows the button on game start
            $('#start').show();
        }

    },
    //Method to determine answer clicked
    guessChecker: function () {

        //Timer ID for gameResult setTimeout
        var resultId;

        //The answer to the current question being asked
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

        //If the option picked matches the answer of the current question, increment correct
        if ($(this).text() === currentAnswer) {
            //Turn button green for correct
            $(this).addClass('btn-success').removeClass('btn-info');

            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Dojyaaan! Thats right!</h3>');
        }
        //If option picked does not match the answer to the current question, increment incorrect
        else {
            //Turn button clicked red for incorrect
            $(this).addClass('btn-danger').removeClass('btn-info');

            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Yare yare daze... its ' + currentAnswer + '</h3>');
        }

    },
    //Method to remove previous question results and options
    guessResult: function () {

        //Increment to next question set
        trivia.currentSet++;

        //Clears the options and results
        $('.option').remove();
        $('#results h3').remove();

        //Run nextQuestion
        trivia.nextQuestion();

    }

}