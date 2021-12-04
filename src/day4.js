const _ = require('lodash/fp');
const chalk = require('chalk');

class BingoBoard {
  constructor(rawBoard) {
    this.numPositions = {};
    this.board = rawBoard.split('\n').map((line, y) =>
      line.match(/\d+/g).map((n, x) => {
        this.numPositions[n] = [x, y];
        return Number(n);
      }),
    );
    this.markedPositions = [];
  }

  print() {
    this.board.forEach(line => {
      line.forEach(n => {
        if (this.markedPositions.includes(this.numPositions[n])) {
          process.stdout.write(chalk.red(n) + ' '.repeat(n >= 10 ? 2 : 3));
        } else {
          process.stdout.write(n + ' '.repeat(n >= 10 ? 2 : 3));
        }
      });
      process.stdout.write('\n');
    });
    process.stdout.write('\n\n');
  }

  getPosition([x, y]) {
    return this.board[y][x];
  }

  markNumber(n) {
    if (this.numPositions[n]) this.markedPositions.push(this.numPositions[n]);
  }

  getSumOfUnmarkedNumbers() {
    return _.sum(
      Object.keys(this.numPositions)
        .map(Number)
        .filter(n => !this.markedPositions.includes(this.numPositions[n])),
    );
  }

  isSolved() {
    if (this.markedPositions.length < 5) return false;

    const matchesInCols = {};
    const matchesInRows = {};

    this.markedPositions.forEach(([x, y]) => {
      if (!matchesInCols[x]) matchesInCols[x] = 0;
      if (!matchesInRows[y]) matchesInRows[y] = 0;
      matchesInCols[x]++;
      matchesInRows[y]++;
    });

    const isSolved = [...Object.values(matchesInCols), ...Object.values(matchesInRows)].some(
      n => n === 5,
    );
    return isSolved;
  }
}

const parse = input => {
  const [rawOrder, ...rawBoards] = input.split('\n\n');

  const order = rawOrder.split(',').map(Number);
  const boards = rawBoards.map(rawBoard => new BingoBoard(rawBoard));

  return { order, boards };
};

const part1 = input => {
  const { order, boards } = parse(input);

  for (let i = 0; i < order.length; i++) {
    const n = order[i];
    boards.forEach(board => board.markNumber(n));
    const solvedBoard = boards.find(board => board.isSolved());
    if (solvedBoard) {
      return solvedBoard.getSumOfUnmarkedNumbers() * n;
    }
  }
};

const part2 = input => {
  const { order, boards } = parse(input);

  let unsolvedBoards = [...boards];

  for (let i = 0; i < order.length; i++) {
    const n = order[i];
    unsolvedBoards.forEach(board => board.markNumber(n));
    if (unsolvedBoards.length === 1 && unsolvedBoards[0].isSolved()) {
      return unsolvedBoards[0].getSumOfUnmarkedNumbers() * n;
    }
    unsolvedBoards = unsolvedBoards.filter(board => !board.isSolved());
  }
};

module.exports = { part1, part2 };
