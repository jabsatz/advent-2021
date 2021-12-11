const _ = require('lodash/fp');
const chalk = require('chalk');

class Map {
  constructor(input) {
    this.rawMap = input.split('\n').map(line => line.split('').map(Number));
  }

  keyFrom = ([x, y]) => `${x}, ${y}`;

  get = ([x, y]) => this.rawMap[y][x];

  isInMap = ([x, y]) => y >= 0 && y < this.rawMap.length && x >= 0 && x < this.rawMap[y].length;

  getAdjacents = ([x, y]) =>
    [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(this.isInMap);

  forEachPosition(predicate) {
    for (let y = 0; y < this.rawMap.length; y++) {
      for (let x = 0; x < this.rawMap[y].length; x++) {
        predicate([x, y]);
      }
    }
  }

  logBasin = basin => {
    this.forEachPosition(pos => {
      if (pos[0] === 0) process.stdout.write('\n');
      if (basin.has(this.keyFrom(pos)))
        process.stdout.write(chalk.bgRed(chalk.black(`${this.get(pos)}`)));
      else process.stdout.write(`${this.get(pos)}`);
    });
    process.stdout.write('\n\n');
  };
}

const parse = input => new Map(input);

const isLowPoint = (pos, map) => {
  const positions = map.getAdjacents(pos);
  return positions.every(_pos => map.get(pos) < map.get(_pos));
};

const findLowPoints = map => {
  const points = [];
  map.forEachPosition(pos => {
    if (isLowPoint(pos, map)) points.push(pos);
  });
  return points;
};

const getBasin = (initialPos, map) => {
  let queue = _.sortBy(map.get, map.getAdjacents(initialPos)).filter(
    adjecentPos => map.get(adjecentPos) < 9,
  );
  let visited = new Set([map.keyFrom(initialPos)]);
  while (queue.length > 0) {
    const pos = queue.shift();
    const nextAdjacents = map
      .getAdjacents(pos)
      .filter(
        adjecentPos =>
          map.get(adjecentPos) < 9 &&
          !visited.has(map.keyFrom(adjecentPos)) &&
          !queue.find(queuePos => map.keyFrom(queuePos) === map.keyFrom(adjecentPos)),
      );
    queue = [...queue, ...nextAdjacents];

    visited.add(map.keyFrom(pos));
  }
  return visited;
};

const part1 = input => {
  const map = parse(input);
  const points = findLowPoints(map);
  return _.sum(points.map(point => map.get(point) + 1));
};

const part2 = input => {
  const map = parse(input);
  const points = findLowPoints(map);
  // const basins = points.flatMap(point => [...getBasin(point, map)]);
  // map.logBasin(new Set(basins));
  return points
    .map(point => getBasin(point, map).size)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, curr) => acc * curr, 1);
};

module.exports = { part1, part2 };
