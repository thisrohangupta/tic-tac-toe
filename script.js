const board = document.getElementById('board');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            return gameBoard[a];
        }
    }
    return null;
}

function checkTie() {
    return !gameBoard.includes('');
}

function botMove() {
    if (!gameActive) return;

    let bestMove;
    let bestScore = -Infinity;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== undefined) {
        gameBoard[bestMove] = 'O';
        document.querySelector(`.cell[data-index='${bestMove}']`).textContent = 'O';
        currentPlayer = 'X';
    }
    
    handleResultDisplay();
}

function minimax(board, depth, isMaximizing) {
    let result = checkWin();
    if (result !== null) {
        return result === 'O' ? 1 : -1;
    }
    if (!board.includes('')) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] !== '' || !gameActive) return;

    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    handleResultDisplay();

    if (gameActive) {
        botMove();
    }
}

function handleResultDisplay() {
    let winner = checkWin();
    if (winner) {
        message.textContent = `Player ${winner} wins!`;
        gameActive = false;
    } else if (checkTie()) {
        message.textContent = 'Tie game!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function handleReset() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = `Player ${currentPlayer}'s turn`;
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', handleReset);

message.textContent = `Player ${currentPlayer}'s turn`;