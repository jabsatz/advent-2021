const _ = require("lodash/fp");

const parseCoords = (...args) => {
  let x, y;
  if (_.isArray(args[0])) {
    [x, y] = args[0];
  } else if (_.isString(args[0])) {
    [x, y] = args[0].split(",").map(Number);
  } else if (args.length === 2) {
    [x, y] = args;
  }
  return [x, y];
};

const hallway = ["1,1", "2,1", "4,1", "6,1", "8,1", "10,1", "11,1"].map(
  parseCoords
);
const burrowsStart = ["3,2", "5,2", "7,2", "9,2"].map(parseCoords);
const amphipodTargets = {
  A: 3,
  B: 5,
  C: 7,
  D: 9,
};
const amphipodEnergy = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

class BurrowChart {
  constructor(input) {
    if (_.isString(input)) {
      this.rawChart = input.split("\n").map((line) => line.split(""));
    } else {
      this.rawChart = input;
    }
    this.boundaries = [this.rawChart[0].length - 1, this.rawChart.length - 1];
    this.burrowDepth = this.boundaries[1] - 2;
  }

  keyFrom = ([x, y]) => `${x},${y}`;

  get = (...args) => {
    const [x, y] = parseCoords(...args);
    return this.rawChart[y][x];
  };

  getAmphipod = (pos) => {
    const result = this.get(pos);
    if (["A", "B", "C", "D"].includes(result)) return result;
    return null;
  };

  move = (from, to) => {
    const amphipod = this.get(from);
    const newChart = [...this.rawChart.map((row) => [...row])];
    newChart[from[1]][from[0]] = ".";
    newChart[to[1]][to[0]] = amphipod;
    return new BurrowChart(newChart);
  };

  getDistance = (from, to) =>
    from[1] - 1 + (to[1] - 1) + Math.abs(from[0] - to[0]);

  isSolved = () =>
    burrowsStart.every((pos) =>
      _.range(0, this.burrowDepth).every(
        (i) => amphipodTargets[this.get(pos[0], pos[1] + i)] === pos[0]
      )
    );

  print = () => {
    console.log(this.rawChart.map((row) => row.join("")).join("\n"));
  };
}

const getMovableAmphipods = (chart) =>
  _.compact(
    burrowsStart.map((pos) => {
      let firstAmphipodPos = null;
      for (let i = 0; i < chart.burrowDepth; i++) {
        const y = i + pos[1];
        if (chart.get(pos[0], y) !== ".") {
          firstAmphipodPos = [pos[0], y];
          break;
        }
      }
      if (firstAmphipodPos) {
        const amphipod = chart.get(firstAmphipodPos);
        if (amphipodTargets[amphipod] === pos[0]) {
          // check others
          const areAmphipodsOrdered = _.range(
            firstAmphipodPos[1] - pos[1],
            chart.burrowDepth
          ).every((i) => {
            const y = i + pos[1];
            return chart.get(pos[0], y) === amphipod;
          });
          if (areAmphipodsOrdered) return null;
          return firstAmphipodPos;
        } else {
          return firstAmphipodPos;
        }
      }
      return null;
    })
  ).concat(hallway.filter((pos) => chart.get(pos) !== "."));

const getTargetsFromPos = (chart, pos) => {
  const amphipod = chart.get(pos);
  const targetBurrow = amphipodTargets[amphipod];
  const isInHallway = pos[0] === 1;

  // Check if can move to final burrow
  for (let y = chart.burrowDepth + 1; y >= 2; y--) {
    const tile = chart.get(targetBurrow, y);
    if (tile === ".") {
      return [[targetBurrow, y]];
    }
    if (tile !== amphipod) {
      if (isInHallway) {
        return [];
      } else {
        break;
      }
    }
  }
  let targets = [];
  // Check if can move in the hallway
  const leftHallway = hallway.filter((hallwayPos) => hallwayPos[0] < pos[0]);
  for (let i = leftHallway.length - 1; i >= 0; i--) {
    if (chart.get(leftHallway[i]) !== ".") break;
    targets.push(leftHallway[i]);
  }
  const rightHallway = hallway.filter((hallwayPos) => hallwayPos[0] > pos[0]);
  for (let i = 0; i < rightHallway.length; i++) {
    if (chart.get(rightHallway[i]) !== ".") break;
    targets.push(rightHallway[i]);
  }
  return targets;
};

const solveDFS = (chart) => {
  // 47241 is a solution for part 2
  let minEnergy = Infinity;
  const dfs = (chart, energy) => {
    if (energy >= minEnergy) {
      return;
    }
    if (chart.isSolved()) {
      chart.print();
      console.log(energy);
      minEnergy = energy;
      return;
    }
    const movableAmphipods = getMovableAmphipods(chart);
    movableAmphipods.forEach((pos) => {
      const amphipod = chart.get(pos);
      const targets = getTargetsFromPos(chart, pos);
      targets.forEach((targetPos) => {
        const cost =
          chart.getDistance(pos, targetPos) * amphipodEnergy[amphipod];
        const newChart = chart.move(pos, targetPos);
        dfs(newChart, energy + cost);
      });
    });
  };
  dfs(chart, 0);
  return minEnergy;
};

const solveBFS = (originalChart) => {
  // 47241 is a solution for part 2
  let minEnergy = 47241;
  let queue = [{ chart: originalChart, energy: 0 }];
  while (queue.length > 0) {
    const { chart, energy } = queue.shift();
    if (energy > minEnergy) {
      continue;
    }
    if (chart.isSolved()) {
      chart.print();
      console.log(energy);
      minEnergy = energy;
      continue;
    }
    const movableAmphipods = getMovableAmphipods(chart);
    movableAmphipods.forEach((pos) => {
      const amphipod = chart.get(pos);
      const targets = getTargetsFromPos(chart, pos);
      targets.forEach((targetPos) => {
        const cost =
          chart.getDistance(pos, targetPos) * amphipodEnergy[amphipod];
        const newChart = chart.move(pos, targetPos);
        queue.push({ chart: newChart, energy: energy + cost });
      });
    });
  }
  return minEnergy;
};

const parse = (input) => new BurrowChart(input);

const part1 = (input) => {
  const burrowChart = parse(input);
  // console.log(getMovableAmphipods(burrowChart));
  return solveDFS(burrowChart);
};

const part2 = (input) => {
  parse(input);
};

module.exports = {
  part1,
  part2,
  BurrowChart,
  getMovableAmphipods,
  getTargetsFromPos,
};
