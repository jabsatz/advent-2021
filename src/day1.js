const _ = require('lodash/fp');

const parse = input => input.split('\n').map(Number);

const getIncreasedTimes = numbers => {
  let increasedTimes = 0;
  numbers.forEach((number, i, arr) => {
    if (i === 0) return;
    if (number > arr[i - 1]) increasedTimes++;
  });
  return increasedTimes;
};

const part1 = input => {
  const numbers = parse(input);

  return getIncreasedTimes(numbers);
};

const part2 = input => {
  const numbers = parse(input);

  const groupedNumbers = numbers
    .map((number, i, arr) => {
      if (i > arr.length - 2) return 0;
      return number + arr[i + 1] + arr[i + 2];
    })
    .slice(0, -2);
  return getIncreasedTimes(groupedNumbers);
};

module.exports = { part1, part2 };
