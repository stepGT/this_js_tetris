import { Tetris } from './tetris.js';
import { convertPositionToIndex, PLAYFIELD_COLS, PLAYFIELD_ROWS, SAD } from './utils.js';

let timeoutID;
let requestID;
let hammer;
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');
//

const drawGhostTetromino = () => {
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;
  //
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.ghostRow + row < 0) continue;
      const cellIndex = convertPositionToIndex(
        tetris.tetromino.ghostRow + row,
        tetris.tetromino.ghostColumn + column,
      );
      cells[cellIndex].classList.add('ghost');
    }
  }
};

const draw = () => {
  cells.forEach((cell) => cell.removeAttribute('class'));
  drawPlayfield();
  drawTetromino();
  drawGhostTetromino();
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

const startLoop = () => {
  timeoutID = setTimeout(() => (requestID = requestAnimationFrame(moveDown)), 700);
};

const stopLoop = () => {
  cancelAnimationFrame(requestID);
  clearTimeout(timeoutID);
};

const drawSad = () => {
  const TOP_OFFSET = 5;
  for (let row = 0; row < SAD.length; row++) {
    for (let column = 0; column < SAD[0].length; column++) {
      if (!SAD[row][column]) continue;
      const cellIndex = convertPositionToIndex(TOP_OFFSET + row, column);
      cells[cellIndex].classList.add('sad');
    }
  }
};

const gameOverAnimation = () => {
  const filledCells = [...cells].filter((cell) => cell.classList.length > 0);
  filledCells.forEach((cell, i) => {
    setTimeout(() => cell.classList.add('hide'), i * 10);
    setTimeout(() => cell.removeAttribute('class'), i * 10 + 500);
  });

  setTimeout(drawSad, filledCells.length * 10 + 1000);
};

const gameOver = () => {
  stopLoop();
  document.removeEventListener('keydown', onKeydown);
  hammer.off('panstart panleft panright pandown swipedown tap');
  gameOverAnimation();
};

const moveDown = () => {
  tetris.moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();
  //
  if (tetris.isGameOver) {
    gameOver();
  }
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

const dropDown = () => {
  tetris.dropTetrominoDown();
  draw();
  stopLoop();
  startLoop();

  if (tetris.isGameOver) {
    gameOver();
  }
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
    case ' ':
      dropDown();
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

const initTouch = () => {
  document.addEventListener('dblclick', (event) => {
    event.preventDefault();
  });

  hammer = new Hammer(document.querySelector('body'));
  hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

  const threshold = 30;
  let deltaX = 0;
  let deltaY = 0;

  hammer.on('panstart', () => {
    deltaX = 0;
    deltaY = 0;
  });

  hammer.on('panleft', (event) => {
    if (Math.abs(event.deltaX - deltaX) > threshold) {
      moveLeft();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });

  hammer.on('panright', (event) => {
    if (Math.abs(event.deltaX - deltaX) > threshold) {
      moveRight();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });

  hammer.on('pandown', (event) => {
    if (Math.abs(event.deltaY - deltaY) > threshold) {
      moveDown();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });

  hammer.on('swipedown', (event) => {
    dropDown();
  });

  hammer.on('tap', () => {
    rotate();
  });
};

initKeydown();
initTouch();
moveDown();
