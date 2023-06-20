import { PLAYFIELD_COLS, PLAYFIELD_ROWS } from './utils.js';

export class Tetris {
  constructor() {
    this.playfield;
    this.init();
  }

  init() {
    this.generatePlayfield();
  }

  generatePlayfield() {
    this.playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLS).fill(0));
    console.table(this.playfield);
  }
}
