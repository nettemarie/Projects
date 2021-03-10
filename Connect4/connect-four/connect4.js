/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++){
    board.push(Array.from({length: WIDTH}));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
let htmlBoard = document.getElementById("board")
  // TODO: add comment for this code

  let top = document.createElement("tr");//creating table row element on the top
  top.setAttribute("id", "column-top");//setting the id for the top row to be "column-top"
  top.addEventListener("click", handleClick);//adding a click event listener to the top row

  for (let x = 0; x < WIDTH; x++) { //creating a loop over the WIDTH/row of the table
    let headCell = document.createElement("td");//creating a table data element for the first cells
    headCell.setAttribute("id", x);//setting the head cells id to be "x"
    top.append(headCell);//appending the head cells to the top row
  }
  htmlBoard.append(top);//appending the top row to the html board

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {//looping over the height/column  of the table
    const row = document.createElement("tr");//creating a table row element for each column
    for (let x = 0; x < WIDTH; x++) {//looping over the width/row of the table
      const cell = document.createElement("td");//creating table data cells in each row
      cell.setAttribute("id", `${y}-${x}`);//setting the cells id to be "y-x"
      row.append(cell);//appending each cell to the row
    }
    htmlBoard.append(row);//appending the row to the html board
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let y = HEIGHT - 1; y >= 0; y--){//loop starting at the bottom row
    if(!board[y][x]){//if the board value is not the y value from the loop
      return y;//then return the y value
    }
  }
  return null;//if not return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const newDiv = document.createElement("div");//creating a div element
  newDiv.classList.add("piece");//add the class "piece" ti the div
  newDiv.classList.add(`p${currPlayer}`);//add the class "p1" or "p2" depending on the value of the current player
  
const clickedCell = document.getElementById(`${y}-${x}`);//setting the clicked cell id to be the x and y value of that clicked cell

clickedCell.append(newDiv)
}

/** endGame: announce game end */

function endGame(msg) {
  window.alert(msg)
  // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(board.every(row=>row.every(clickedCell => clickedCell))){//check every row to see if all the cells are clicked cells
    return endGame("It's a tie!");
  }
 

  // switch players
  // TODO: switch currPlayer 1 <-> 2

  currPlayer = currPlayer === 1 ? 2 : 1;//check if the current player is equal to 1. If it is then the value becomes 2, if it is not the the value becomes 1.


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

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {//looping over each row
    for (let x = 0; x < WIDTH; x++) {//looping over each column
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];//checks for a horizontal win by keeping the row, y, the same and adding 1 to the column, x.
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];//checks for a vertical win by keeping the column, x, the same and adding 1 to the row, y.
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];//checks for a right diagonal win by adding 1 to both the row, y, and column, x.
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];//checks for a left diagonal win by adding 1 to the row, y, but subtracting 1 from the row, x.

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {//if any of these are true then return true
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
