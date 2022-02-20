const conditionChoices = Array.from(document.querySelectorAll('.condition__choice'));

conditionChoices.forEach((button) => {
    button.addEventListener('click', (e) => {
        localStorage.setItem('fiftyFiftyValue', button.value);
        localStorage.setItem('mostRecentMode', button.value);
        return window.location.assign('/game');
    });
});