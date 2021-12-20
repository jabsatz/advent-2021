const _ = require("lodash/fp");
const chalk = require("chalk");

class Chart {
  constructor(input) {
    const [algorithm, rawImage] = input.split("\n\n");
    this.rawChart = {};
    rawImage.split("\n").forEach((line, y) => {
      line
        .split("")
        .forEach((tile, x) => (this.rawChart[this.keyFrom([x, y])] = tile));
    });
    this.algorithm = algorithm;
    this.boundaries = {
      minX: 0,
      minY: 0,
      maxX: rawImage.split("\n")[0].length - 1,
      maxY: rawImage.split("\n").length - 1,
    };
    this.outOfBoundsTile = ".";
  }

  keyFrom = ([x, y]) => `${x}, ${y}`;

  get = (pos) => {
    let x, y;
    if (_.isArray(pos)) {
      [x, y] = pos;
    } else if (_.isString(pos)) {
      [x, y] = pos.split(", ").map(Number);
    }
    return this.rawChart[this.keyFrom([x, y])]
      ? this.rawChart[this.keyFrom([x, y])]
      : this.outOfBoundsTile;
  };

  getSquare = ([x, y]) => [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];

  getDistance = ([x1, y1], [x2, y2]) =>
    Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

  forEachPosition(predicate) {
    for (let y = this.boundaries.minY; y < this.boundaries.maxY; y++) {
      for (let x = this.boundaries.minX; x < this.boundaries.maxX; x++) {
        predicate([x, y]);
      }
    }
  }

  everyPosition(predicate) {
    for (let y = this.boundaries.minY; y < this.boundaries.maxY; y++) {
      for (let x = this.boundaries.minX; x < this.boundaries.maxX; x++) {
        if (!predicate([x, y])) return false;
      }
    }
    return true;
  }

  logChart = (predicate = () => false) => {
    this.forEachPosition((pos) => {
      if (pos[0] === this.boundaries.minX) process.stdout.write("\n");
      if (predicate(pos))
        process.stdout.write(chalk.bgRed(chalk.black(`${this.get(pos)}`)));
      else process.stdout.write(`${this.get(pos)}`);
    });
    process.stdout.write("\n\n");
  };

  enhance = () => {
    this.boundaries = {
      minX: this.boundaries.minX - 2,
      minY: this.boundaries.minY - 2,
      maxX: this.boundaries.maxX + 2,
      maxY: this.boundaries.maxY + 2,
    };
    let newChart = {};
    this.forEachPosition((pos) => {
      const binary = parseInt(
        this.getSquare(pos)
          .map((_pos) => (this.get(_pos) === "." ? "0" : "1"))
          .join(""),
        2
      );
      newChart[this.keyFrom(pos)] = this.algorithm[binary];
    });
    this.rawChart = newChart;
    this.outOfBoundsTile =
      this.algorithm[
        parseInt((this.outOfBoundsTile === "." ? "0" : "1").repeat(9), 2)
      ];
  };
}

const parse = (input) => new Chart(input);

const part1 = (input) => {
  const chart = parse(input);
  chart.enhance();
  chart.logChart();
  chart.enhance();
  chart.logChart();
  let amount = 0;
  chart.forEachPosition((pos) => {
    if (chart.get(pos) === "#") amount++;
  });
  return amount;
};

const part2 = (input) => {
  const chart = parse(input);
  for (let i = 1; i <= 50; i++) {
    chart.enhance();
    chart.logChart();
  }
  let amount = 0;
  chart.forEachPosition((pos) => {
    if (chart.get(pos) === "#") amount++;
  });
  return amount;
};

module.exports = { part1, part2 };
