const username = document.querySelector('#username');
const saveButton = document.querySelector('#submit');

const endScore = document.querySelector('.end-score');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const mostRecentMode = localStorage.getItem('mostRecentMode');
const highscores = JSON.parse(localStorage.getItem('highscores')) || [[], [], [], []];


endScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveButton.disabled = !username.value;
});

saveScore = e => {
    e.preventDefault();

    const score = {
        mode: mostRecentMode,
        name: username.value,
        score: mostRecentScore
    };
    highscores[mostRecentMode].push(score);

    highscores[mostRecentMode].sort((a, b) => {
        return b.score - a.score;
    });

    highscores[mostRecentMode].splice(5);

    localStorage.setItem('highscores', JSON.stringify(highscores));
    window.location.assign('/home');
}

