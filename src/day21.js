const _ = require('lodash/fp');

class Board {
  constructor(input) {
    this.rawBoard = input.split('\n').map(line => Number(line.match(/\d+$/)[0]) - 1);
    this.scores = [0, 0];
    this.rawDice = 0;
    this.currentPlayer = 0;
    this.diceRolls = 0;
  }

  get board() {
    return this.rawBoard.map(b => b + 1);
  }
  get dice() {
    return this.dice + 1;
  }

  playerWon() {
    return this.scores.some(score => score >= 1000);
  }

  playRound() {
    const spacesToMove = this.rawDice + ((this.rawDice + 1) % 100) + ((this.rawDice + 2) % 100) + 3;
    this.diceRolls += 3;
    this.rawDice = (this.rawDice + 3) % 100;
    this.rawBoard[this.currentPlayer] = (this.rawBoard[this.currentPlayer] + spacesToMove) % 10;
    this.scores[this.currentPlayer] += this.board[this.currentPlayer];
    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
  }
}

class QuantumBoard {
  constructor(input) {
    this.quantumBoards = {};
    const initialBoardKey =
      input
        .split('\n')
        .map(line => Number(line.match(/\d+$/)[0]) - 1)
        .join(',') + '-0,0';
    this.quantumBoards[initialBoardKey] = 1;
    this.currentPlayer = 0;
  }

  get possibleRolls() {
    return [
      { total: 3, times: 1 },
      { total: 4, times: 3 },
      { total: 5, times: 6 },
      { total: 6, times: 7 },
      { total: 7, times: 6 },
      { total: 8, times: 3 },
      { total: 9, times: 1 },
    ];
  }

  allFinished() {
    return Object.keys(this.quantumBoards).every(key => this.keyFinished(key));
  }

  keyFinished(key) {
    const [_, scores] = this.parseKey(key);
    return scores.some(score => score >= 21);
  }

  parseKey = key => key.split('-').map(p => p.split(',').map(Number));

  playRound() {
    let newQuantumBoards = {};
    Object.entries(this.quantumBoards).forEach(([key, amount]) => {
      if (this.keyFinished(key)) {
        if (!newQuantumBoards[key]) newQuantumBoards[key] = 0;
        newQuantumBoards[key] += amount;
        return;
      }
      this.possibleRolls.forEach(roll => {
        let [board, scores] = this.parseKey(key);
        board[this.currentPlayer] = (board[this.currentPlayer] + roll.total) % 10;
        scores[this.currentPlayer] += board[this.currentPlayer] + 1;
        const newKey = `${board.join(',')}-${scores.join(',')}`;
        if (!newQuantumBoards[newKey]) newQuantumBoards[newKey] = 0;
        newQuantumBoards[newKey] += amount * roll.times;
      });
    });
    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    this.quantumBoards = newQuantumBoards;
  }

  getWins() {
    let wins = [0, 0];
    Object.entries(this.quantumBoards).forEach(([key, amount]) => {
      const [_, scores] = this.parseKey(key);
      const winner = scores.findIndex(score => score >= 21);
      wins[winner] += amount;
    });
    return wins;
  }
}

const parse = input => input.split('\n').map(line => Number(line.match(/\d+$/)[0]) - 1);

const part1 = input => {
  const board = new Board(input);
  while (!board.playerWon()) {
    board.playRound();
  }
  return Math.min(...board.scores) * board.diceRolls;
};

const part2 = input => {
  const quantumBoard = new QuantumBoard(input);
  while (!quantumBoard.allFinished()) {
    quantumBoard.playRound();
  }
  return Math.max(...quantumBoard.getWins());
};

module.exports = { part1, part2 };
