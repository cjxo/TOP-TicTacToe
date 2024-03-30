function Player(name, marker) {
    let score = 0;
    const increaseScore = () => ++score;
    const getScore = () => score;

    return { name, marker, increaseScore, getScore };
}

const gameState = (function Gameboard(playerOne, playerTwo) {
    const divGameBoard = document.querySelector(".board");
    const divStatusBar = document.querySelector(".status-bar");
    const divPlayer1Score = document.querySelector(".sidebar > div:nth-child(2) > div:nth-child(1)");
    const divPlayer2Score = document.querySelector(".sidebar > div:nth-child(2) > div:nth-child(2)");
    const resetButton = document.querySelector(".reset-button");
    
    let moveCount = 0;
    let playerPlaying = playerOne;
    let playerWillChoose = true;
    
    divStatusBar.textContent = "Turn: " + playerPlaying.name;
    divPlayer1Score.textContent = playerOne.name + `(${playerOne.marker}): ` + playerOne.getScore();
    divPlayer2Score.textContent = playerTwo.name + `(${playerTwo.marker}): ` + playerTwo.getScore();
    
    resetButton.addEventListener("click", (event) => {
        for (const child of divGameBoard.children) {
            child.textContent = '';
            child.style.color = "black";
        }
    
        moveCount = 0;
        playerPlaying = playerOne;
        playerWillChoose = true;
        divStatusBar.textContent = "Turn: " + playerPlaying.name;
    });
    
    for (const child of divGameBoard.children) {
        child.addEventListener("click", event => {
            let marker = null;
            let newPlayerPlaying = null;
            if (!child.textContent && playerWillChoose) {
                marker = playerPlaying.marker;

                if (playerPlaying === playerOne) {
                    newPlayerPlaying = playerTwo;
                } else {
                    newPlayerPlaying = playerOne;
                }
    
                divStatusBar.textContent = "Turn: " + newPlayerPlaying.name;
            }

            if (marker) {
                let didntFindAnyMarkerTripleMatches = true;
                ++moveCount;
                child.textContent = marker;
    
                const possibleLines = [
                    [0, 1, 2],  [3, 4, 5], [6, 7, 8], // horizontal lines
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical lines
                    [0, 4, 8], [2, 4, 6] // cross / diag lines
                ];
    
                for (let index = 0; index < possibleLines.length; ++index) {
                    const [a, b, c] = possibleLines[index];
                    const markerInBoard = divGameBoard.children[a].textContent;
                    if (markerInBoard && (markerInBoard === divGameBoard.children[b].textContent) &&
                        (markerInBoard === divGameBoard.children[c].textContent)) {
                        playerPlaying.increaseScore();
    
                        possibleLines[index].forEach(cellIndex => {
                            divGameBoard.children[cellIndex].style.color = "red";
                        });
    
                        didntFindAnyMarkerTripleMatches = false;
                        break;
                    }
                }

                if (didntFindAnyMarkerTripleMatches && (moveCount === 9)) {
                    divStatusBar.textContent = "Tied!";
                    playerWillChoose = false;
                } else if (!didntFindAnyMarkerTripleMatches) {
                    divPlayer1Score.textContent = playerOne.name + `(${playerOne.marker}): ` + playerOne.getScore();
                    divPlayer2Score.textContent = playerTwo.name + `(${playerTwo.marker}): ` + playerTwo.getScore();
                    divStatusBar.textContent = playerPlaying.name + " won!";
                    playerWillChoose = false;
                } else {
                    playerWillChoose = true
                }
                playerPlaying = newPlayerPlaying;
            }
        });
    }
})(Player("Player 1", "X"), Player("Player 2", "O"));