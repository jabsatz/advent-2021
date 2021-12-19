const _ = require('lodash/fp');
const chalk = require('chalk');

class Chart {
  constructor(input) {
    this.rawChart = input.split('\n').map(line => line.split('').map(Number));
    this.boundaries = [this.rawChart[0].length - 1, this.rawChart.length - 1];
  }

  keyFrom = ([x, y]) => `${x}, ${y}`;

  get = pos => {
    let x, y;
    if (_.isArray(pos)) {
      [x, y] = pos;
    } else if (_.isString(pos)) {
      [x, y] = pos.split(', ').map(Number);
    }
    return this.rawChart[y][x];
  };

  set = ([x, y], value) => {
    this.rawChart[y][x] = value;
  };

  isInChart = ([x, y]) => x >= 0 && x <= this.boundaries[0] && y >= 0 && y <= this.boundaries[1];

  getAdjacents = ([x, y]) =>
    [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(this.isInChart);

  getDistance = ([x1, y1], [x2, y2]) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

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

  logChart = (predicate = () => false) => {
    this.forEachPosition(pos => {
      if (pos[0] === 0) process.stdout.write('\n');
      if (predicate(pos)) process.stdout.write(chalk.bgRed(chalk.black(`${this.get(pos)}`)));
      else process.stdout.write(`${this.get(pos)}`);
    });
    process.stdout.write('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
  };

  getPathAStar = (startPos, endPos) => {
    const endKey = this.keyFrom(endPos);
    const buildQueueEntry = (pos, prevEntry) => ({
      key: this.keyFrom(pos),
      pos,
      routes: this.getAdjacents(pos),
      distanceLeft: this.getDistance(pos, endPos),
      ...(prevEntry
        ? {
            distance: prevEntry.distance + this.get(pos),
            via: prevEntry.key,
          }
        : { distance: 0 }),
    });
    let queue = [buildQueueEntry(startPos)];
    let visited = {};
    while (queue.length > 0) {
      const entry = queue.shift();
      visited[entry.key] = entry;
      if (entry.key === endKey) {
        break;
      }

      entry.routes.forEach(pos => {
        if (visited[this.keyFrom(pos)]) return;
        const newEntry = buildQueueEntry(pos, entry);
        const existingEntryIndex = queue.findIndex(entry => entry.key === newEntry.key);
        if (existingEntryIndex === -1) {
          queue.push(newEntry);
        } else if (newEntry.distance < queue[existingEntryIndex].distance) {
          queue[existingEntryIndex] = newEntry;
        }
      });
      queue = _.sortBy(entry => entry.distanceLeft + entry.distance, queue);
    }
    let path = [visited[endKey]];
    while (path[0].via) {
      path.unshift(visited[path[0].via]);
    }
    return path;
  };
}

const parse = input => new Chart(input);

const part1 = input => {
  const chart = parse(input);
  const path = chart.getPathAStar([0, 0], chart.boundaries);
  // chart.logChart(pos => path.some(entry => entry.key === chart.keyFrom(pos)));
  return _.last(path).distance;
};

const part2 = input => {
  const largeInput = `${input}\n\n`
    .repeat(5)
    .split('\n\n')
    .map((block, i) => {
      return block
        .split('\n')
        .map(line => {
          return `${line} `
            .repeat(5)
            .split(' ')
            .map((subLine, j) =>
              subLine
                .split('')
                .map(char => `${((Number(char) + i + j - 1) % 9) + 1}`)
                .join(''),
            )
            .join('');
        })
        .join('\n');
    })
    .join('\n')
    .trim();
  return part1(largeInput);
};

module.exports = { part1, part2 };
