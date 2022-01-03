const _ = require("lodash/fp");

class Chart {
  constructor(input) {
    this.rawChart = input.split("\n").map((line) => line.split(""));
    this.boundaries = [this.rawChart[0].length - 1, this.rawChart.length - 1];
  }

  static empty(sizeX, sizeY) {
    return new Chart(
      _.range(0, sizeY + 1)
        .map(() =>
          _.range(0, sizeX + 1)
            .map(() => ".")
            .join("")
        )
        .join("\n")
    );
  }

  keyFrom = ([x, y]) => `${x}, ${y}`;

  get = (pos) => {
    let x, y;
    if (_.isArray(pos)) {
      [x, y] = pos;
    } else if (_.isString(pos)) {
      [x, y] = pos.split(", ").map(Number);
    }
    return this.rawChart[y][x];
  };

  set = ([x, y], value) => {
    this.rawChart[y][x] = value;
  };

  isInChart = ([x, y]) =>
    x >= 0 && x <= this.boundaries[0] && y >= 0 && y <= this.boundaries[1];

  getNext = ([x, y]) => {
    const tile = this.get([x, y]);
    if (tile === ">") return [(x + 1) % (this.boundaries[0] + 1), y];
    if (tile === "v") return [x, (y + 1) % (this.boundaries[1] + 1)];
  };

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

  moveCucumbers(cucumberTile) {
    const newChart = Chart.empty(this.boundaries[0], this.boundaries[1]);
    this.forEachPosition((pos) => {
      const tile = this.get(pos);
      if (tile === cucumberTile) {
        const nextPos = this.getNext(pos);
        if (this.get(nextPos) === ".") {
          this.movedAmount++;
          newChart.set(nextPos, cucumberTile);
        } else {
          newChart.set(pos, cucumberTile);
        }
      } else if (tile !== cucumberTile && tile !== ".") {
        newChart.set(pos, this.get(pos));
      }
    });
    this.rawChart = newChart.rawChart;
  }

  processStep() {
    this.moveCucumbers(">");
    this.moveCucumbers("v");
  }

  findStopStep() {
    for (let step = 1; true; step++) {
      this.movedAmount = 0;
      this.processStep();
      if (this.movedAmount === 0) {
        return step;
      }
      this.movedAmount = 0;
    }
  }

  logChart = (predicate = () => false) => {
    this.forEachPosition((pos) => {
      if (pos[0] === 0) process.stdout.write("\n");
      if (predicate(pos))
        process.stdout.write(chalk[predicate(pos)](`${this.get(pos)}`));
      else process.stdout.write(`${this.get(pos)}`);
    });
    process.stdout.write("\n");
  };
}

const parse = (input) => new Chart(input);

const part1 = (input) => {
  const chart = parse(input);
  return chart.findStopStep();
};

const part2 = () => "Merry christmas";

module.exports = { part1, part2 };
