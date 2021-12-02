const _ = require('lodash/fp');

const parse = input =>
  input.split('\n').map(line => {
    const [instruction, value] = line.split(' ');
    return [instruction, Number(value)];
  });

const part1 = input => {
  const steps = parse(input);

  const finalPosition = steps.reduce(
    (acc, [instruction, value]) => {
      switch (instruction) {
        case 'forward':
          return [acc[0] + value, acc[1]];
        case 'up':
          return [acc[0], acc[1] - value];
        case 'down':
          return [acc[0], acc[1] + value];
      }
    },
    [0, 0],
  );

  return finalPosition[0] * finalPosition[1];
};

const part2 = input => {
  const steps = parse(input);

  const finalPosition = steps.reduce(
    (acc, [instruction, value]) => {
      switch (instruction) {
        case 'forward':
          return [acc[0] + value, acc[1] + value * acc[2], acc[2]];
        case 'up':
          return [acc[0], acc[1], acc[2] - value];
        case 'down':
          return [acc[0], acc[1], acc[2] + value];
      }
    },
    [0, 0, 0],
  );

  return finalPosition[0] * finalPosition[1];
};

module.exports = { part1, part2 };
