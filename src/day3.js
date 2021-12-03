const _ = require('lodash/fp');

const parse = input => input.split('\n');

const part1 = input => {
  const binaries = parse(input);

  const counts = binaries.reduce(
    (acc, binary) => acc.map((count, index) => (binary[index] === '1' ? count + 1 : count)),
    new Array(binaries[0].length).fill(0),
  );

  const gamma = counts.map(count => (count > binaries.length / 2 ? '1' : '0')).join('');
  const epsilon = counts.map(count => (count < binaries.length / 2 ? '1' : '0')).join('');

  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

const getRating = ratingFn => binaries => {
  let numbersLeft = [...binaries];
  for (let i = 0; i < binaries[0].length; i++) {
    binariesWithOnes = numbersLeft.filter(binary => binary[i] === '1');
    if (ratingFn(binariesWithOnes, numbersLeft)) {
      numbersLeft = binariesWithOnes;
    } else {
      numbersLeft = numbersLeft.filter(binary => binary[i] === '0');
    }
    if (numbersLeft.length === 1) {
      return parseInt(numbersLeft[0], 2);
    }
  }
};

const getOxygenRating = getRating(
  (binariesWithOnes, numbersLeft) => binariesWithOnes.length >= numbersLeft.length / 2,
);
const getCO2Rating = getRating(
  (binariesWithOnes, numbersLeft) => binariesWithOnes.length < numbersLeft.length / 2,
);

const part2 = input => {
  const binaries = parse(input);

  const oxygenRating = getOxygenRating(binaries);
  const co2Rating = getCO2Rating(binaries);

  return oxygenRating * co2Rating;
};

module.exports = { part1, part2 };
