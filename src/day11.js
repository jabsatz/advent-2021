const _ = require('lodash/fp');
const chalk = require('chalk');

class Chart {
  constructor(input) {
    this.rawChart = input.split('\n').map(line => line.split('').map(Number));
  }

  keyFrom = ([x, y]) => `${x}, ${y}`;

  get = ([x, y]) => this.rawChart[y][x];

  set = ([x, y], value) => {
    this.rawChart[y][x] = value;
  };

  isInChart = ([x, y]) =>
    y >= 0 && y < this.rawChart.length && x >= 0 && x < this.rawChart[y].length;

  getAdjacents = ([x, y]) =>
    [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
      [x - 1, y - 1],
      [x + 1, y + 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
    ].filter(this.isInChart);

  forEachPosition(predicate) {
    for (let y = 0; y < this.rawChart.length; y++) {
      for (let x = 0; x < this.rawChart[y].length; x++) {
        predicate([x, y]);
      }
    }
  }

  everyPosition(predicate) {
    for (let y = 0; y < this.rawChart.length; y++) {
      for (let x = 0; x < this.rawChart[y].length; x++) {
        if (!predicate([x, y])) return false;
      }
    }
    return true;
  }

  logChart = () => {
    this.forEachPosition(pos => {
      if (pos[0] === 0) process.stdout.write('\n');
      if (this.get(pos) === 0) process.stdout.write(chalk.bgRed(chalk.black(`${this.get(pos)}`)));
      else process.stdout.write(`${this.get(pos)}`);
    });
    process.stdout.write('\n\n');
  };
}

const parse = input => new Chart(input);

const part1 = input => {
  const chart = parse(input);
  let flashCount = 0;
  for (let step = 1; step <= 100; step++) {
    let newFlashes = [];
    chart.forEachPosition(position => {
      const value = chart.get(position);
      if (value === 9) newFlashes.push(position);
      chart.set(position, value === 9 ? 0 : value + 1);
    });
    while (newFlashes.length > 0) {
      const position = newFlashes.shift();
      flashCount++;
      chart.getAdjacents(position).forEach(adjPos => {
        const value = chart.get(adjPos);
        if (value === 0) return;
        if (value === 9) newFlashes.push(adjPos);
        chart.set(adjPos, value === 9 ? 0 : value + 1);
      });
    }
  }
  return flashCount;
};

const part2 = input => {
  const chart = parse(input);
  for (let step = 1; true; step++) {
    let newFlashes = [];
    chart.forEachPosition(position => {
      const value = chart.get(position);
      if (value === 9) newFlashes.push(position);
      chart.set(position, value === 9 ? 0 : value + 1);
    });
    while (newFlashes.length > 0) {
      const position = newFlashes.shift();
      chart.getAdjacents(position).forEach(adjPos => {
        const value = chart.get(adjPos);
        if (value === 0) return;
        if (value === 9) newFlashes.push(adjPos);
        chart.set(adjPos, value === 9 ? 0 : value + 1);
      });
    }
    const allFlashes = chart.everyPosition(pos => chart.get(pos) === 0);
    if (allFlashes) return step;
  }
};

module.exports = { part1, part2 };
