let openedCards = [];
let matchedCards = [];
let moveCounter = 0;
let allCards = [];
let deck = document.getElementById('deck');
let messagePanel = document.getElementById('message-panel');
const STEPS = 300;
const STARS = 3;
const STAR_WEIGHT = STEPS / STARS;
const SHAPES = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf',
    'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf',
    'fa-bicycle', 'fa-bomb'];
const INITIAL_RATING = [true, true, true];
let gameIsOver = false;
let gameIsWon = false;
let rating = [true, true, true];
let timerId;

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function displayCard(event) {
    event.target.classList.add('open', 'show');
}

function addToOpenedCards(card) {
    openedCards.push(card);
}

function getCardSymbol(card) {
    return card.querySelector('.fa').classList[1];
}

function matchCards(card1, card2) {
    return getCardSymbol(card1) === getCardSymbol(card2);
}

function lockCard(...cards) {
    cards.forEach((card) => {
        card.classList.add('match', 'animation-match');
        matchedCards.push(card);
    });
}

function hideCard(...cards) {
    cards.forEach((card) => {
        card.classList.add('animation-notmatch');
        setTimeout(() => {
            card.classList.remove('open', 'show', 'animation-notmatch');
        }, 300);
    });
}

function addMove() {
    moveCounter++;
}

/* Messages */

function createMessage(text) {
    stopTimer(timerId);
    deck.classList.add('hide');
    let message = document.createElement('div');
    message.innerHTML = text;
    messagePanel.appendChild(message);
    messagePanel.classList.add('message-panel');
    removeListener();
}

function winnerMessage(moves) {
    let starsCounter = (moves / STAR_WEIGHT).toFixed();
    let text = `<div>Congratulations! You Won!</div>
                        <div>With ${moves} moves and ${starsCounter} Stars</div>
                        <div>Woooooo!</div>`;
    createMessage(text);
}

function overMessage(moves) {
    let starsCounter = (moves / STAR_WEIGHT).toFixed();
    let text = `<div>Game is over!</div>
                        <div>With ${moves} moves and ${starsCounter} Stars</div>`;
    createMessage(text);
}

/* Rating */

function setMoveCounter() {
    document.getElementById('moveCounter').innerHTML = moveCounter.toString();
}

function createStar(status = '') {
    let star = document.createElement('li');
    star.innerHTML = `<i class='fa fa-star ${status}'></i>`;
    return star;
}

function setRating(ratingArr) {
    let ratingFragment = document.createDocumentFragment();

    ratingArr.forEach((star) => {
        let createdStar = (star) ? createStar('active') : createStar();
        ratingFragment.appendChild(createdStar);
    });

    document.getElementById('rating').innerHTML = '';
    document.getElementById('rating').appendChild(ratingFragment);
}

/* Manage game */

function restart() {
    messagePanel.innerHTML = '';
    messagePanel.classList.remove('message-panel');
    stopTimer(timerId);
    startTimer();
    moveCounter = 0;
    openedCards = [];
    setRating(INITIAL_RATING);
    setMoveCounter();
    generateGrid();

    allCards.forEach((card) => {
        card.addEventListener("click", clickCard);
    });
}

function startGame() {
    startTimer();
    setRating(rating);
    generateGrid();
    allCards.forEach((card) => {
        card.addEventListener("click", clickCard);
    });
}

function generateGrid() {
    deck.classList.remove('hide');
    deck.innerHTML = '';
    let grid = document.createDocumentFragment();
    let shapes = shuffle(SHAPES);

    shapes.forEach((shape) => {
        let cardElement = document.createElement('li');
        cardElement.className = "card";
        cardElement.innerHTML = `<i class="fa ${shape}"></i>`;
        grid.appendChild(cardElement);
    });

    deck.appendChild(grid);

    allCards = document.querySelectorAll('.deck .card');
}

function clickCard(event) {
    if (!this.className.includes('match')) {
        addToOpenedCards(this);
        displayCard(event);
        if (openedCards.length === 2) {
            openedCards.reduce((card1, card2) => {
                openedCards = [];
                addMove();
                setMoveCounter();
                rating = rating.map((star, index) => STEPS - moveCounter >= (index + 1) * STAR_WEIGHT);
                setRating(rating);

                if (matchCards(card1, card2)) {
                    lockCard(card1, card2);
                } else {
                    hideCard(card1, card2);
                }

                if (matchedCards.length === SHAPES.length) {
                    gameIsWon = true;
                    winnerMessage(moveCounter);
                } else if (moveCounter === STEPS) {
                    gameIsOver = true;
                    overMessage(moveCounter);
                }
            });
        }
    }
}

/* Timer */

function startTimer() {
    let timerElement = document.getElementById('timer');
    let start = Date.now();
    timerId = setInterval(function run() {
        let timer = Date.now() - start;
        timerElement.innerHTML = (timer.toString() / 1000).toFixed();
    }, 1000);
}

function stopTimer(timerId) {
    clearInterval(timerId);
}

function removeListener() {
    allCards.forEach((card) => {
        card.addEventListener("click", clickCard);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    startGame();

    document.querySelector('.restart').addEventListener('click', () => {
        restart();
    });
});




