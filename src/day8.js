const _ = require('lodash/fp');

const parse = input =>
  input.split('\n').map(line => {
    const [allSegments, output] = line.split(' | ').map(group => group.split(' '));
    return { allSegments, output };
  });

const part1 = input => {
  const matchingSignalLengths = [2, 3, 4, 7];
  const entries = parse(input);
  return entries.reduce(
    (acc, { output }) =>
      acc + output.filter(signal => matchingSignalLengths.includes(signal.length)).length,
    0,
  );
};

const digitMap = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
};

class WireSolver {
  constructor(input) {
    this.originalInput = input;
    this.input = input;
    this.decipherMap = {};
  }

  // 1 (2 digit) -> [cf]
  // 7 (3 digit) -> a
  // 4 (4 digit) -> [bd]
  // 9 (6 digit, includes acfbd) -> g
  // 8 (7 digit) -> e
  // 6 (6 digit, includes abdeg + [c or f]) -> c, f
  // 0 (6 digit, includes acfeg + [b or d]) -> b, d

  getInput(predicate) {
    const result = this.input.find(predicate);
    this.input = this.input.filter(s => s !== result);
    return result.split('');
  }

  decipherSegments() {
    const one = this.getInput(s => s.length === 2);
    const seven = this.getInput(s => s.length === 3);
    this.decipherMap['a'] = seven.find(c => !one.includes(c));
    const four = this.getInput(s => s.length === 4);
    const nine = this.getInput(
      s => s.length === 6 && _.uniq([...one, ...seven, ...four]).every(c => s.includes(c)),
    );
    this.decipherMap['g'] = nine.find(c => !_.uniq([...one, ...seven, ...four]).includes(c));
    const eight = this.getInput(s => s.length === 7);
    this.decipherMap['e'] = eight.find(c => !nine.includes(c));
    const six = this.getInput(s => s.length === 6 && (!s.includes(one[0]) || !s.includes(one[1])));
    this.decipherMap['f'] = six.find(c => one.includes(c));
    this.decipherMap['c'] = one.find(c => c !== this.decipherMap['f']);
    const zero = this.getInput(s => s.length === 6);
    this.decipherMap['b'] = zero.find(c => four.includes(c) && !one.includes(c));
    this.decipherMap['d'] = four.find(c => c !== this.decipherMap['b'] && !one.includes(c));

    // Invert decipherMap for easier output parsing
    this.decipherMap = _.fromPairs(
      Object.entries(this.decipherMap).map(([key, val]) => [val, key]),
    );
  }

  parseOutput(output) {
    const correctedOutputs = output.map(s => {
      const correctedSegments = s
        .split('')
        .map(c => this.decipherMap[c])
        .sort()
        .join('');
      return digitMap[correctedSegments];
    });
    return Number(correctedOutputs.join(''));
  }
}

const part2 = input => {
  const entries = parse(input);
  const decodedOutputs = entries.map(({ allSegments, output }) => {
    const wireSolver = new WireSolver(allSegments);
    wireSolver.decipherSegments();
    return wireSolver.parseOutput(output);
  });
  return _.sum(decodedOutputs);
};

module.exports = { part1, part2 };
