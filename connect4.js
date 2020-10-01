/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let gamePlaying = false;
let settingVisible = false;
let p1Color = '';
let p2Color = '';

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for(let i = 0; i < HEIGHT; i++){
    board.push(Array.from({length : WIDTH}))
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const htmlBoard = document.getElementById('board');

function makeHtmlBoard() {
  appendTop();
  appendRow();
}

function appendTop() {
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);
}

function appendRow() {
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for(let i = HEIGHT-1; i >= 0; i--) {
    if (!board[i][x]) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement('div');
  const placement = document.getElementById(`${y}-${x}`)
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  if (currPlayer === 1){
    piece.style.backgroundColor = p1Color
    document.querySelector('h3').style.textDecorationColor = p2Color
    document.querySelector('h3').innerText = `Player 2's Turn`
  } else {
    piece.style.backgroundColor = p2Color
    document.querySelector('h3').style.textDecorationColor = p1Color
    document.querySelector('h3').innerText = `Player 1's Turn`
  }
  placement.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  gamePlaying = false;
  document.querySelector('h3').innerText = msg;
  currPlayer === 1 ? document.querySelector('h3').style.textDecorationColor = p1Color : document.querySelector('h3').style.textDecorationColor = p2Color;
  setTimeout(function(){
    alert(msg);
  }, 200);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gamePlaying === false){
    return;
  }
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(col => col))) {
    return endGame('The game is a draw.');
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}


document.querySelector('button[class=startbutton]').addEventListener('click', startGame);

function startGame(){
 if ( gamePlaying === true && confirm('Are you sure you want to restart your current game?')){
  gamePlaying = false;
  startGame();
}
  setSettings();
  board = [];
  currPlayer = 1;
  document.querySelector('h3').style.textDecorationColor = p1Color;
  document.querySelector('h3').innerText = `Player 1's Turn`
  document.querySelector('#board').innerHTML = "";
  makeBoard();
  makeHtmlBoard();
  gamePlaying = true;
}

document.querySelector('button[class=settingsbutton]').addEventListener('click', openSettingsMenu);

function openSettingsMenu(){
  if (settingVisible === false){
    document.querySelector('div[class="settingsmenu"]').style.visibility="visible";
    document.querySelector('div[class="settingsmenu"]').style.height="70px";
    settingVisible = true;
  } else {
    document.querySelector('div[class="settingsmenu"]').style.visibility="hidden";
    document.querySelector('div[class="settingsmenu"]').style.height="0px";
    settingVisible = false;
  }
}

function setSettings(){
  let widthInput = document.querySelector('input[class="boardwidth"]').value;
  let heightInput = document.querySelector('input[class="boardheight"]').value;
  if (widthInput <= 0 || widthInput > 20){
    widthInput = 7;
    document.querySelector('input[class="boardwidth"]').value = '';
  }
  if (heightInput <= 0 || heightInput > 20){
    heightInput = 6;
    document.querySelector('input[class="boardheight"]').value = '';
  }
  if (widthInput !== ''){
    WIDTH = widthInput;
  }
  if (heightInput !== ''){
    HEIGHT = heightInput;
  }
  p1Color = document.querySelector('input[class="p1colorinput"]').value;
  p2Color =document.querySelector('input[class="p2colorinput"]').value;
}