import { createCardElement, flipCard } from './card.js';
import { gameStart } from './game.js';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍', '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];
const gameBoard = document.getElementById('game-board');

const counterDiv = document.getElementById('counter');

export const cardCountInput = document.getElementById('card-count-input');

const resetButton = document.createElement('button');

const triesCounter = document.createElement('h2');

const timerText = document.createElement('h3');

const overlay = document.getElementById('overlay');

const endOfGameStat = document.getElementById('triesText');

const closeOverlay = document.getElementById('closeOverlay');

const cardflipAudio = new Audio('../cardflip.mp3');
const matchAudio = new Audio('../mariocoin.mp3');

let firstCard = null;
let secondCard = null;
export let lockBoard = false;

let tries = 0;

let matchesNeeded = 0;
let matches = 0;

let time = 0;

let isOver = false;

closeOverlay.addEventListener('click', () => overlay.hidden = true);

resetButton.addEventListener('click', () => {
    resetGame();
});



setInterval(() =>{
    if(!isOver){
    time += 1;
    timerText.innerHTML = `Kulunut aika: ${time}`;
    }
}, 1000);

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}


export function createBoard(cardCount) {
    isOver = false;
    time = 0;
    matches = 0;

    cardCountInput.hidden = true;
    const selectedCards = [];

    for (let i = 0; i < cardCount / 2;){
        let selection = allCards[Math.floor(Math.random() * allCards.length)];
        
        if(selectedCards.includes(selection)){
            continue;
        }

        selectedCards.push(selection);
        console.log(cardCount);
        i++;
    }

    matchesNeeded = selectedCards.length;
    const cards = [...selectedCards, ...selectedCards];
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        cardElement.addEventListener('click', () => flipCard(cardElement, handleCardFlip));
        gameBoard.appendChild(cardElement);
    });
    updateTryCounter();
    counterDiv.appendChild(triesCounter);
    counterDiv.appendChild(timerText);
    resetButton.textContent = "Resetoi lauta";
    document.body.appendChild(resetButton);
}

function handleCardFlip(cardElement) {
    if (lockBoard) return;
    if (cardElement === firstCard) return;

    cardflipAudio.play();

    cardElement.classList.add('flipped');
    cardElement.textContent = cardElement.dataset.card;

    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    lockBoard = true;
    secondCard = cardElement;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    tries += 1;
    updateTryCounter();

    if(isMatch){

        matches += 1;

        matchAudio.play();

        if(matches == matchesNeeded){
            disableCards();
            gameOver();
        }

        disableCards();

    }else{

        unflipCards();
        
    }
    
}

function gameOver(){
    isOver = true;
    setTimeout(() =>{
        overlay.hidden = false;
        endOfGameStat.innerHTML = `Yritykset: ${tries}, Kulunut aika: ${time}`;
    }, 500);
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetGame(){
    gameBoard.replaceChildren();
    counterDiv.replaceChildren();
    document.body.removeChild(resetButton); 

    tries = 0;
    time = 0;
    cardCountInput.hidden = false;

    gameStart();
    
}

function updateTryCounter(){
    triesCounter.innerHTML = `Yritykset: ${tries}`;
}