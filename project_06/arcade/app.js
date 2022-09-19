//States and trying to add two different game modes for each player type made me waste way too much time. Next timt I will do a lot better.
//Ended up scrapping most of it due to time.

// HTML References / DOM Selectors
const cells = document.querySelectorAll(".cell");
const endOverlay = document.querySelector(".endOverlay");
const endOverlayText = document.querySelector(".endOverlay .endText");
const resetButtonElement = document.getElementById("reset");

/*
Here we declare some variables that we will use to track the 
game state throught the game. 
*/
const state = {};

function buildInitialState() {
  state.board = Array.from(Array(9).keys());
  state.currentPlayer = "X";
  state.aiPlayer = "O";
  state.winningNumbers = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];
}

// ************************ DOM Manipulation ****************************

function render() {
  endOverlay.style.display = "none";
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnPlayer, false);
  }
}

function turnPlayer(boardPos) {
  if (typeof state.board[boardPos.target.id] == "number") {
    turn(boardPos.target.id, state.currentPlayer);
    if (!checkTie()) turn(aiMove(), state.aiPlayer);
  }
}

// If gameWin is null, it doesn't run and there isn't a winner.
// If true, it sends gameWin (player and index) to gameOver function.
function turn(boardPosId, player) {
  state.board[boardPosId] = player;
  document.getElementById(boardPosId).innerText = player;
  let gameWin = checkWin(state.board, player);
  if (gameWin) gameOver(gameWin);
}

// Find all places on board that have been played in, using reduce method.
// Along with an arrow function and terinary operator to help condense it.
// Goes through every element of the board array and gives accumulator at the end.
// Adds index to the intialized accumulator array. Having an issue with reduce, had it working before.
function checkWin(board, player) {
  let playedInPos = board.reduce(
    (a, e, i) => (e === player ? a.concat(i) : a),
    []
  );

  let gameWin = null;

  // Goes through the nested arrays of state.winningNumbers and checks to see if each ->
  // check if the numbers are > -1. loops for if player played in all spots.
  for (let [index, win] of state.winningNumbers.entries()) {
    if (win.every((elem) => playedInPos.indexOf(elem) > -1)) {
      gameWin = { index: index, player: player };
      break;
    }
  }
  return gameWin;
}

// Style all winning blocks and disallow clicking after win.
function gameOver(gameWin) {
  for (let index of state.winningNumbers[gameWin.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWin.player == state.currentPlayer ? "seagreen" : "salmon";
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnPlayer, false);
  }
  gameWinner(
    gameWin.player == state.currentPlayer
      ? "Congratulations you WON!"
      : "Sorry, you lose."
  );
}

function gameWinner(winner) {
  endOverlay.style.display = "block";
  endOverlayText.innerText = winner;
}

// Finds empty squares, checking for X's,O's.
function emptyBoardPos() {
  return state.board.filter((s) => typeof s == "number");
}

// Simple AI move to open slot.
function aiMove() {
  return emptyBoardPos()[0];
}

function checkTie() {
  if (emptyBoardPos().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "palegreen";
      cells[i].removeEventListener("click", turnPlayer, false);
    }
    gameWinner("It's a TIE!");
    return true;
  }
  return false;
}

resetButtonElement.addEventListener("click", function (event) {
  buildInitialState();
  render();
});

buildInitialState();
render();

//ctrl + .  Allows quick fixes and converting arrow functions
