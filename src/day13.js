const _ = require('lodash/fp');
const chalk = require('chalk');

const parse = input => {
  const [rawDots, rawFolds] = input.split('\n\n');
  const dots = rawDots.split('\n').map(line => line.split(',').map(Number));
  const folds = rawFolds.split('\n').map(line => {
    const [_, axis, pos] = line.match(/(x|y)=(\d+)/);
    return { axis: axis === 'x' ? 0 : 1, pos: Number(pos) };
  });
  return { dots, folds };
};

const part1 = input => {
  const instructions = parse(input);
  let dots = [...instructions.dots];
  const { axis, pos } = instructions.folds[0];
  let newDots = new Set();
  dots.forEach(dot => {
    const newDot = dot.map((n, i) => (i === axis && n > pos ? 2 * pos - n : n));
    newDots.add(newDot.join(','));
  });
  dots = [...newDots].map(pos => pos.split(',').map(Number));
  return dots.length;
};

const part2 = input => {
  const instructions = parse(input);
  let dots = [...instructions.dots];
  instructions.folds.forEach(({ axis, pos }) => {
    let newDots = new Set();
    dots.forEach(dot => {
      const newDot = dot.map((n, i) => (i === axis && n > pos ? 2 * pos - n : n));
      newDots.add(newDot.join(','));
    });
    dots = [...newDots].map(pos => pos.split(',').map(Number));
  });

  let dotsMap = {};
  dots.forEach(([x, y]) => (dotsMap[`${x},${y}`] = true));
  const maxX = Math.max(...dots.map(([x]) => x));
  const maxY = Math.max(...dots.map(([_, y]) => y));
  for (let y = 0; y <= maxY; y++) {
    process.stdout.write('\n');
    for (let x = 0; x <= maxX; x++) {
      if (dotsMap[`${x},${y}`]) process.stdout.write(chalk.bgWhite(' '));
      else process.stdout.write(' ');
    }
  }
  process.stdout.write('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');

  return 'Check the log above :)';
};

module.exports = { part1, part2 };
