import {
  PLAYFIELD_COLS,
  PLAYFIELD_ROWS,
  TETROMINO_NAMES,
  TETROMINOES,
  getRandomElement,
  rotateMatrix,
} from './utils.js';

export class Tetris {
  constructor() {
    this.playfield;
    this.tetromino;
    this.init();
  }

  init() {
    this.generatePlayfield();
    this.generateTetromino();
  }

  generatePlayfield() {
    this.playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLS).fill(0));
  }

  generateTetromino() {
    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];

    const column = PLAYFIELD_COLS / 2 - Math.floor(matrix.length / 2);
    const row = 3;

    this.tetromino = {
      name,
      matrix,
      row,
      column,
      ghostColumn: column,
      ghostRow: row,
    };
  }

  moveTetrominoDown() {
    this.tetromino.row += 1;
    if (!this.isValid()) {
      this.tetromino.row -= 1;
    }
  }

  moveTetrominoLeft() {
    this.tetromino.column -= 1;
    if (!this.isValid()) {
      this.tetromino.column += 1;
    }
  }

  moveTetrominoRight() {
    this.tetromino.column += 1;
    if (!this.isValid()) {
      this.tetromino.column -= 1;
    }
  }

  rotateTetromino() {
    const oldMatrix = this.tetromino.matrix;
    const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
    this.tetromino.matrix = rotatedMatrix;
    if (!this.isValid()) {
      this.tetromino.matrix = oldMatrix;
    }
  }

  isOutsideOfGameBoard(row, column) {
    return (
      this.tetromino.column + column < 0 ||
      this.tetromino.column + column >= PLAYFIELD_COLS ||
      this.tetromino.row + row >= this.playfield.length
    );
  }

  isCollides(row, column) {
    return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column];
  }

  isValid() {
    const matrixSize = this.tetromino.matrix.length;
    //
    for (let row = 0; row < matrixSize; row++) {
      for (let column = 0; column < matrixSize; column++) {
        if (!this.tetromino.matrix[row][column]) continue;
        if (this.isOutsideOfGameBoard(row, column)) return false;
        if (this.isCollides(row, column)) return false;
      }
    }
    return true;
  }
}
