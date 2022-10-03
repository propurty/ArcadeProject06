// HTML References / DOM Selectors
const cells = document.querySelectorAll(".cell");
const endOverlay = document.querySelector(".endOverlay");
const endOverlayText = document.querySelector(".endOverlay .endText");
const resetButtonElement = document.getElementById("reset");
let currentPlayerDisplay = document.getElementById("currentPlayer"); //Display the current player

const gameModeOverlay = document.querySelector(".gameMode"); //Make this overlay dissappear like the other one.

const twoPlayerMode = document.getElementById("twoPlayer"); //Make ai code not run if clicked.
const singlePlayerMode = document.getElementById("singlePlayer"); //Make two player code not run if clicked.

const startOverlay = document.querySelector(".startOverlay"); // Make overlay come up after gamemode selection. Then have it hide like the others.
let playerXName = document.getElementById("playerX");
let playerOName = document.getElementById("playerO");

const submit = document.getElementById("submitPlayers");

/*
Here we declare some variables that we will use to track the 
game state throughout the game. 
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
  state.gameWin = null;
  state.gameMode = "";
  state.playerX = "X";
  state.playerO = "O";
}

// ************************ DOM Manipulation ****************************

function render() {
  twoPlayerMode.addEventListener("click", overlayGameMode, { once: true });
  singlePlayerMode.addEventListener("click", overlayGameMode, { once: true });

  gameModeOverlay.style.display = "flex";
  startOverlay.style.display = "none";
  endOverlay.style.display = "none";

  playerXName.value = "";
  playerOName.value = "";
  currentPlayerDisplay.innerHTML = "";

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnPlayer, false);
  }
}

function twoPlayerRender() {
  if (state.currentPlayer == "X") {
    currentPlayerDisplay.innerHTML = state.playerX;
  } else if (state.currentPlayer == "O") {
    currentPlayerDisplay.innerHTML = state.playerO;
  }
}

function turnPlayer(boardPos) {
  if (typeof state.board[boardPos.target.id] == "number") {
    turn(boardPos.target.id, state.currentPlayer);
    if (state.gameMode == "singlePlayer" && !checkTie()) {
      turn(aiMove(), state.aiPlayer);
    } else if (state.currentPlayer == "X") {
      state.currentPlayer = "O";
    } else state.currentPlayer = "X";

    if (state.gameMode == "twoPlayer") {
      twoPlayerRender();
    }
  }
}

// If gameWin is null, it doesn't run and there isn't a winner.
// If true, it sends gameWin (player and index) to gameOver function.

//Had a bug coming from lines 79 and 94 causing player to be null. Can't figure that issue out
//Game is so close to no bugs.
function turn(boardPosId, player) {
  state.board[boardPosId] = player;
  console.log(player);
  document.getElementById(boardPosId).innerText = player;
  state.gameWin = checkWin(state.board, player);
  if (state.gameWin && !checkTie()) {
    gameOver(state.gameWin);
  }
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

  // Goes through the nested arrays of state.winningNumbers and checks to see if each ->
  // of the numbers are > -1. loops for if player played in all spots.
  for (let [index, win] of state.winningNumbers.entries()) {
    if (win.every((elem) => playedInPos.indexOf(elem) > -1)) {
      state.gameWin = { index: index, player: player };
      break;
    }
  }
  return state.gameWin;
}

// Style all winning blocks and disallow clicking after win.
function gameOver(gameWin) {
  state.gameWin = gameWin;
  for (let index of state.winningNumbers[state.gameWin.index]) {
    document.getElementById(index).style.backgroundColor =
      state.gameWin.player == state.currentPlayer ? "seagreen" : "crimson";
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnPlayer, false);
  }

  if (state.gameMode == "singlePlayer") {
    gameWinner(
      state.gameWin.player == state.currentPlayer
        ? "Congratulations you WON!"
        : "Sorry, you lose."
    );
  } else if (state.gameMode == "twoPlayer") {
    gameWinner(
      state.gameWin.player == "X"
        ? `${state.playerX} WON!`
        : `${state.playerO} WON!`
    );
  }
}

function gameWinner(winner) {
  endOverlay.style.display = "block";
  endOverlayText.innerText = winner;
  endOverlayText.addEventListener("click", overlayEnd, { once: true });
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
  if (emptyBoardPos().length == 0 && !state.gameWin) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "palegreen";
      cells[i].removeEventListener("click", turnPlayer, false);
    }
    gameWinner("It's a TIE!");
    return true;
  }
  return false;
}

function overlayGameMode(event) {
  gameModeOverlay.style.display = "none";

  state.gameMode = event.target.id;

  if (state.gameMode == "twoPlayer") {
    startOverlayEnd();
  } else {
    currentPlayerDisplay.innerHTML = "Computer is O";
    return;
  }
}

function startOverlayEnd() {
  startOverlay.style.display = "flex";

  submit.addEventListener("click", () => {
    state.playerX = playerXName.value;
    state.playerO = playerOName.value;
    startOverlay.style.display = "none";
    twoPlayerRender();
  });

  return;
}

function overlayEnd() {
  endOverlay.style.display = "none";
  currentPlayerDisplay.innerHTML = "";
}

// submit.addEventListener("click", () => {
//   state.playerX = playerXName.value;
//   state.playerO = playerOName.value;
//   startOverlay.style.display = "none";
// });

resetButtonElement.addEventListener("click", function (event) {
  buildInitialState();
  render();
});

buildInitialState();
render();

//ctrl + .  Allows quick fixes and converting arrow functions
