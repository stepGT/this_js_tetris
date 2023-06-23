import { Tetris } from './tetris.js';
import { convertPositionToIndex, PLAYFIELD_COLS, PLAYFIELD_ROWS } from './utils.js';

const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');
//
const draw = () => {
  cells.forEach((cell) => cell.removeAttribute('class'));
  drawPlayfield();
  drawTetromino();
};

const drawPlayfield = () => {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLS; column++) {
      if (!tetris.playfield[row][column]) continue;
      const name = tetris.playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
};

const moveDown = () => {
  tetris.moveTetrominoDown();
  draw();
};

const moveLeft = () => {
  tetris.moveTetrominoLeft();
  draw();
};

const moveRight = () => {
  tetris.moveTetrominoRight();
  draw();
};

const rotate = () => {
  tetris.rotateTetromino();
  draw();
};

const onKeydown = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      rotate();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    default:
      break;
  }
};

const initKeydown = () => {
  document.addEventListener('keydown', onKeydown);
};

const drawTetromino = () => {
  const name = tetris.tetromino.name;
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.row + row < 0) continue;
      const cellIndex = convertPositionToIndex(
        tetris.tetromino.row + row,
        tetris.tetromino.column + column,
      );
      cells[cellIndex].classList.add(name);
    }
  }
};

initKeydown();
draw();
