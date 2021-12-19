const _ = require('lodash/fp');

class Vec3 {
  constructor(input) {
    const [x, y, z] = input.split(',').map(Number);
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Scanner {
  constructor(key) {
    this.key = key;
    this.positions = [];
  }

  addPosition(input) {
    this.positions.push(new Vec3(input));
  }
}

const parse = input =>
  input.split('\n\n').map(rawScanner => {
    return rawScanner.split('\n').reduce((scanner, line) => {
      if (!scanner) {
        const key = Number(line.match(/\d+/)[0]);
        return new Scanner(key);
      }
      scanner.addPosition(line);
      return scanner;
    }, undefined);
  });

const part1 = input => {
  const scanners = parse(input);
  console.log(scanners);
};

const part2 = input => {
  parse(input);
};

module.exports = { part1, part2 };
