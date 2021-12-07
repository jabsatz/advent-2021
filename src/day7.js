const _ = require('lodash/fp');

const parse = input => input.split(',').map(Number);

const part1 = input => {
  const positions = parse(input);
  const medianPosition = positions.sort((a, b) => a - b)[Math.round((positions.length - 1) / 2)];
  return positions.reduce((acc, pos) => acc + Math.abs(pos - medianPosition), 0);
};

const part2 = input => {
  const positions = parse(input);
  const averagePosition = Math.round(_.sum(positions) / positions.length);
  return positions.reduce((acc, pos) => {
    const diff = Math.abs(pos - averagePosition);
    return acc + (diff * (diff + 1)) / 2;
  }, 0);
};

module.exports = { part1, part2 };
