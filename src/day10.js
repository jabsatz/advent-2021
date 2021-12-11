const _ = require('lodash/fp');

const parse = input => input.split('\n');

const closeMap = {
  '{': '}',
  '[': ']',
  '(': ')',
  '<': '>',
};

const invalidPointsMap = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const closePointsMap = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
};

const getInvalidCharacter = line => {
  let context = [];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (Object.keys(closeMap).includes(char)) {
      context.push(char);
    } else if (closeMap[context[context.length - 1]] === char) {
      context.pop();
    } else {
      return char;
    }
  }
  return null;
};

const part1 = input => {
  const lines = parse(input);
  return lines.reduce((acc, line) => {
    const invalidCharacter = getInvalidCharacter(line);
    if (invalidCharacter) {
      return acc + invalidPointsMap[invalidCharacter];
    }
    return acc;
  }, 0);
};

const part2 = input => {
  const lines = parse(input);
  const orderedResults = lines
    .filter(line => !getInvalidCharacter(line))
    .map(line => {
      let context = [];
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (Object.keys(closeMap).includes(char)) {
          context.push(char);
        } else {
          context.pop();
        }
      }
      return context.reduceRight(
        (multiplicator, char) => multiplicator * 5 + closePointsMap[char],
        0,
      );
    })
    .sort((a, b) => a - b);
  return orderedResults[(orderedResults.length - 1) / 2];
};

module.exports = { part1, part2 };
