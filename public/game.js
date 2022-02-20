const game = document.querySelector('.game');
const loader = document.querySelector('.loader');

const question = document.querySelector('.question');
const choiceContainer = document.querySelectorAll('.choice__container');
const choices = Array.from(document.querySelectorAll('.choice__text'));
const scoreText = document.querySelector('#score-text');
const fiftyFifty = document.querySelector('.fifty-fifty');
const fiftyFiftyCounter = document.querySelector('.fifty-fifty__counter');
const abandon = document.querySelectorAll('.abandon');

let inPlay = false;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let availableQuestions = [];
let usedQuestions = [];
let questions = [];
let fiftyFiftyValue = localStorage.getItem('fiftyFiftyValue');
let usedFiftyFifty = false;
fiftyFiftyCounter.innerText = fiftyFiftyValue;


const fetchQuestion = () => {
    fetch('https://opentdb.com/api.php?amount=1&category=9&type=multiple').then(res => {
        return res.json();
    })
        .then(loadedQuestions => {
            questions = loadedQuestions.results.map(loadedQuestion => {
                // checks if question already used in current stack
                if (usedQuestions.includes(loadedQuestion.question)) {
                    return fetchQuestion();
                } else {
                    usedQuestions.push(loadedQuestion.question);
                }
                const formattedQuestion = {
                    question: loadedQuestion.question
                };
                const answerChoices = [...loadedQuestion.incorrect_answers];
                formattedQuestion.answer = rollDie(4);
                answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

                answerChoices.forEach((choice, index) => {
                    formattedQuestion['choice' + (index + 1)] = choice;
                })
                return formattedQuestion
            });
            startGame();

        })
        .catch(error => {
            console.log(error);
        });
};

fetchQuestion();

//CONSTANTS
const CORRECT_BONUS = 1;

startGame = () => {
    if (inPlay == false) {
        inPlay = true;
        questionCounter = 0;
        score = 0;
    }
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuestions.length === 0) {
        fetchQuestion();
    } else {
        // removes fifty-fifty transparency
        for (let i = 0; i < 4; i++) {
            choiceContainer[i].classList.remove('exclude', 'no-hover');
        }

        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex];
        question.innerText = decodeHtml(currentQuestion.question);
        choiceContainer.forEach((choice) => {
            const number = choice.dataset['number'];
            choice.children[1].innerText = decodeHtml(currentQuestion['choice' + number]);
        });

        availableQuestions.splice(questionIndex, 1);
        acceptingAnswers = true;
        usedFiftyFifty = false;
    }
};

choiceContainer.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;
        const selectedChoice = e.currentTarget;

        if (selectedChoice.classList.contains('exclude')) return
        acceptingAnswers = false;

        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply == 'correct') {
            incrementScore();
        } else {
            localStorage.setItem('mostRecentScore', score);

            //go to the end page
            setTimeout(() => {
                return window.location.assign('/end');
            }, 2000);
        }

        selectedChoice.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.classList.remove(classToApply);
            getNewQuestion();
        }, 2000);
    });
});

const incrementScore = () => {
    score += 1;
    scoreText.innerText = score;
};

// decodes HTML entities
const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

const rollDie = (sides) => {
    return Math.floor(Math.random() * sides) + 1;
};



const fiftyFiftyClick = () => {
    if (fiftyFiftyValue > 0 && usedFiftyFifty === false) {
        const answer = currentQuestion.answer;
        let exclude1 = rollDie(4);
        let exclude2 = rollDie(4);

        while (exclude1 === answer) {
            exclude1 = rollDie(4);
        };
        while (exclude2 === answer || exclude2 === exclude1) {
            exclude2 = rollDie(4);
        };

        choiceContainer[exclude1 - 1].classList.add('exclude', 'no-hover');
        choiceContainer[exclude2 - 1].classList.add('exclude', 'no-hover');

        fiftyFiftyValue = fiftyFiftyValue - 1;
        usedFiftyFifty = true;
        fiftyFiftyCounter.innerText = fiftyFiftyValue;
        isEmpty();
    } else { isEmpty() }
    return
};

fiftyFifty.addEventListener('click', () => {
    fiftyFiftyClick();
});


// checks if any 50/50 tokens remaining
const isEmpty = () => {
    if (fiftyFiftyValue == 0) {
        fiftyFifty.classList.add('fifty-fifty_empty', 'no-hover');
        fiftyFiftyCounter.classList.add('fifty-fifty_empty');
        fiftyFifty.disabled = true;
    }
}
isEmpty();


// home button
abandon.forEach((button) => {
    button.addEventListener('click', () => {
        if (confirm('Are you sure you want to go back? Current progress will be lost.')) {
            return window.location.assign('/');
        } else {
            return
        }
    })
})
