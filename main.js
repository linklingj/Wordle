document.addEventListener("DOMContentLoaded", () => {
    getNewWord();
    createSquares();

    let answer;
    let finished = false;
    let guessedWordCount = 0;
    const guessedWords = [[]];
    const keys = document.querySelectorAll('.keyboard-row button');

    function getNewWord() {
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
            {
                method: "GET",
                headers: {
                    'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
                    'X-RapidAPI-Key': '4c4ec7c47amsh928a185b096cbeep108e6cjsnbeb3259acee8'
                },
            }
        )
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            answer = res.word;
        })
        .catch((err) => {
            console.error(err);
        })
    }

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
                handleDelete();
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
        fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                'X-RapidAPI-Key': '4c4ec7c47amsh928a185b096cbeep108e6cjsnbeb3259acee8',
            },
        })
        .then((res) => {
            if (!res.ok) {
                throw Error();
            }

            guessedWordCount++;
            if (currentWord === answer) {
                window.alert("Correct");
                finished = true;
            }
            else {
                if (guessedWordCount === 6) {
                    window.alert(`Sorry, you have no more guesses! The word is ${answer}.`);
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
                    letterEl.classList.add(tileColor);
                    letterEl.classList.add("animate__flipInX");
                }, 200 * index);
            });
        })
        .catch(() => {
            window.alert("Not in word list");
            return;
        })
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
        const letterId = guessedWordCount * 5 + currentWordArr.length;
        const letterEl = document.getElementById(letterId);
        letterEl.innerText = letter;
    }

    function handleDelete() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length >= 1) {
            const letterId = guessedWordCount * 5 + currentWordArr.length;
            const letterEl = document.getElementById(letterId);
            letterEl.innerText = null;
            currentWordArr.pop();
        }
    }

    function createSquares() {
        const gameBoard = document.getElementById("board");
        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index+1);
            gameBoard.appendChild(square);
        }
    }
})