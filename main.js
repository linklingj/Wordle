document.addEventListener("DOMContentLoaded", () => {

    createSquares();
    const answer = "crane";
    let finished = false;
    let guessedWordCount = 0;
    const guessedWords = [[]];
    const keys = document.querySelectorAll('.keyboard-row button');

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({target}) => {
            if (finished) {
                return;
            }
            const key = target.getAttribute("data-key");
            if (key === "enter") {
                handleSubmit();
                return;
            }
            if (key === "del") {
                return;
            }
            updateGuessedWords(key);
        }
    }

    function handleSubmit() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
            return;
        }
        const currentWord = currentWordArr.join("");
        const wordExist = true;
        if (wordExist === false) {
            window.alert("Not in word list");
            return;
        }

        guessedWordCount++;
        if (currentWord === answer) {
            window.alert("Correct");
            finished = true;
        }
        else {
            if (guessedWordCount === 6) {
                window.alert('Sorry, you have no more guesses! The word is ${answer}.');
                finished = true;
            } else {
                guessedWords.push([]);
            }
        }

        currentWordArr.forEach((letter,index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter,index);
                const letterId = (guessedWordCount-1) * 5 + 1 + index;
                const letterEl = document.getElementById(letterId);
                letterEl.innerText = letter;
                letterEl.classList.add(tileColor);
                letterEl.classList.add("animate__flipInX");
            }, 200 * index);
        });
    }

    function getTileColor(letter,index) {
        if (answer.includes(letter)) {
            if (answer.charAt(index) === letter) {
                return "green";
            } else {
                return "yellow";
            }
        } else {
            return "gray";
        }
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords-1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);
        }
    }

    

    function createSquares() {
        const gameBoard = document.getElementById("board");
        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("id", index+1);
            gameBoard.appendChild(square);
        }
    }
})