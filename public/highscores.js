const scoreList = document.querySelector('#score-column');
const nameList = document.querySelector('#name-column');
const highscores = JSON.parse(localStorage.getItem('highscores')) || [[], [], [], []];
const head = document.querySelectorAll('.modes__head');

head.forEach((li) => {

    li.addEventListener('click', (e) => {
        for (item of head) {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            }
        }
        const selectedChoice = e.currentTarget;
        selectedChoice.classList.add('selected');
        if (selectedChoice.classList.contains('modes__head_0')) {
            let mode = 0;
            updater(mode)
        }
        if (selectedChoice.classList.contains('modes__head_1')) {
            let mode = 1;
            updater(mode)
        }
        if (selectedChoice.classList.contains('modes__head_2')) {
            let mode = 2;
            updater(mode)
        }
        if (selectedChoice.classList.contains('modes__head_3')) {
            let mode = 3;
            updater(mode);
        }
    });
})

const updater = (mode) => {
    scoreList.innerHTML = nameList.innerHTML = '';
    for (let highscore of highscores[mode]) {
        scoreList.innerHTML +=
            `<li class='highscores__value'>${highscore.score}</li>`
        nameList.innerHTML +=
            `<li class='highscores__value'>${highscore.name}</li>`
    }
}


