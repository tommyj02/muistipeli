import { createBoard, cardCountInput } from './board.js';

const submitCardCount = document.createElement('button');
const cardCountInputField = document.createElement('input');

document.addEventListener('DOMContentLoaded', () => {
   
    gameStart();

});

submitCardCount.addEventListener('click', () =>{
    let cardCount = parseInt(cardCountInputField.value);
    if (cardCount % 2 !== 0) {
        alert("Korttien määrän täytyy olla parillinen luku.");
        return;
    }
    if (cardCount > 32){
        alert("Korttien määrän pitää olla 2 ja 32 välillä!");
        return;
    }
    createBoard(cardCount);
});

export function gameStart(){

    cardCountInputField.placeholder = "Korttien määrä";

    submitCardCount.textContent = "Vahvista korttien määrä";

    cardCountInput.appendChild(cardCountInputField);
    cardCountInput.appendChild(submitCardCount);
}