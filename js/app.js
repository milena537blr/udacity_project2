/*
 * Create a list that holds all of your cards
 */

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


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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

function lockCard(card) {
    card.classList.add('match');
}

function hideCard(card) {
    card.classList.remove('open', 'show');
}

function addMove() {
    moveCounter++;
}

function winnerMessage(moves) {
    stopTimer(timerId);
    deck.remove();
    let message = document.createElement('div');
    let starsCounter = (moves/STAR_WEIGHT).toFixed();
    message.innerHTML = `<div>Congratulations! You Won!</div>
                        <div>With ${moves} moves and ${starsCounter} Stars</div>
                        <div>Woooooo!</div>`;
    messagePanel.appendChild(message);
}

function overMessage(moves) {
    stopTimer(timerId);
    deck.remove();
    let message = document.createElement('div');
    let starsCounter = (moves/STAR_WEIGHT).toFixed();
    message.innerHTML = `<div>Game is over!</div>
                        <div>With ${moves} moves and ${starsCounter} Stars</div>`;

    messagePanel.appendChild(message);
}

function setMoveCounter() {
    document.getElementById('moveCounter').innerHTML = moveCounter.toString();
}

function setRating(ratingArr) {
    let ratingFragment = document.createDocumentFragment();

    ratingArr.forEach((star) => {
        let starActive = document.createElement('li');
        starActive.innerHTML = "<i class='fa fa-star active'></i>";
        let starInactive = document.createElement('li');
        starInactive.innerHTML = "<i class='fa fa-star'></i>";

        if (star) {
            ratingFragment.appendChild(starActive);
        } else {
            ratingFragment.appendChild(starInactive);
        }
    });

    document.getElementById('rating').innerHTML = '';
    document.getElementById('rating').appendChild(ratingFragment);
}

function restart() {
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

function generateGrid() {
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
                if (matchCards(card1, card2)) {
                    lockCard(card1);
                    lockCard(card2);
                    card1.classList.add('animation-match');
                    card2.classList.add('animation-match');
                    openedCards = [];
                    matchedCards.push(card1);
                    matchedCards.push(card2);
                } else {
                    card1.classList.add('animation-notmatch');
                    card2.classList.add('animation-notmatch');
                    setTimeout(() => {
                        openedCards = [];
                        card1.classList.remove('animation-notmatch');
                        card2.classList.remove('animation-notmatch');
                        hideCard(card1);
                        hideCard(card2);
                    }, 300);
                }
                addMove();
                setMoveCounter();

                if (matchedCards.length === SHAPES.length) {
                    gameIsWon = true;
                    winnerMessage(moveCounter);
                } else if (moveCounter === STEPS) {
                    gameIsOver = true;
                    overMessage(moveCounter);
                }

                rating = rating.map((star, index) => STEPS - moveCounter >= (index + 1) * STAR_WEIGHT);

                setRating(rating);
            });
        }
    }
}

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

function startGame() {
    startTimer();
    setRating(rating);
    generateGrid();
    allCards.forEach((card) => {
        card.addEventListener("click", clickCard);
    });
}

startGame();

let restartButton = document.querySelector('.restart');

restartButton.addEventListener('click', () => {
    restart();
});


