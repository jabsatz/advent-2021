const _ = require('lodash/fp');
const chalk = require('chalk');

class Pair {
  constructor(...args) {
    if (args.length === 1) {
      const input = args[0];
      const firstNumberMatch = input.match(/^\[(\d+),/);
      const secondNumberMatch = input.match(/,(\d+)\]$/);
      if (firstNumberMatch) {
        this.x = Number(firstNumberMatch[1]);
      } else {
        const nestedPair = this.getFirstPair(input);
        this.x = new Pair(nestedPair);
      }

      if (secondNumberMatch) {
        this.y = Number(secondNumberMatch[1]);
      } else {
        const nestedPair = this.getSecondPair(input);
        this.y = new Pair(nestedPair);
      }
    } else if (args.length === 2) {
      this.x = args[0];
      this.y = args[1];
    }
  }

  getFirstPair = string => {
    let depth = 0;
    for (let i = 1; i < string.length; i++) {
      if (string[i] === ']') depth--;
      if (string[i] === '[') depth++;
      if (depth === 0) return string.substring(1, i + 1);
    }
    throw new Error(`Invalid first Pair in "${string}"`);
  };

  getSecondPair = string => {
    let depth = 0;
    for (let i = string.length - 2; i >= 0; i--) {
      if (string[i] === '[') depth--;
      if (string[i] === ']') depth++;
      if (depth === 0) return string.substring(i, string.length - 1);
    }
    throw new Error(`Invalid second Pair in "${string}"`);
  };

  parse = () => {
    return `[${_.isNumber(this.x) ? this.x : this.x.parse()},${
      _.isNumber(this.y) ? this.y : this.y.parse()
    }]`;
  };

  parseHighlight = highlightPair => {
    const parsed = `[${_.isNumber(this.x) ? this.x : this.x.parseHighlight(highlightPair)},${
      _.isNumber(this.y) ? this.y : this.y.parseHighlight(highlightPair)
    }]`;
    if (this === highlightPair) return chalk.greenBright(parsed);
    else return chalk.gray(parsed);
  };
  log = highlightPair => process.stdout.write(this.parseHighlight(highlightPair) + '\n');

  findPathToFirst = (predicate, depth = 1) => {
    if (predicate(this.x, depth)) {
      return ['x'];
    } else if (this.x instanceof Pair) {
      const found = this.x.findPathToFirst(predicate, depth + 1);
      if (found) {
        return ['x', ...found];
      }
    }
    if (predicate(this.y, depth)) {
      return ['y'];
    } else if (this.y instanceof Pair) {
      const found = this.y.findPathToFirst(predicate, depth + 1);
      if (found) {
        return ['y', ...found];
      }
    }
    return null;
  };

  findPathToLast = (predicate, depth = 1) => {
    if (predicate(this.y, depth)) {
      return ['y'];
    } else if (this.y instanceof Pair) {
      const found = this.y.findPathToLast(predicate, depth + 1);
      if (found) {
        return ['y', ...found];
      }
    }
    if (predicate(this.x, depth)) {
      return ['x'];
    } else if (this.x instanceof Pair) {
      const found = this.x.findPathToLast(predicate, depth + 1);
      if (found) {
        return ['x', ...found];
      }
    }
    return null;
  };

  set = (path, newValue) => {
    if (path.length === 1) this[_.head(path)] = newValue;
    else if (_.isNumber(this[_.head(path)]))
      throw new Error(`Attempting to set ${_.head(path)} on pair ${this.parse()}`);
    else this[_.head(path)].set(_.tail(path), newValue);
  };

  get = path => {
    if (path.length === 1) return this[_.head(path)];
    else if (_.isNumber(this[_.head(path)]))
      throw new Error(`Attempting to get ${_.head(path)} on pair ${this.parse()}`);
    else return this[_.head(path)].get(_.tail(path));
  };

  findNumberToSplit = () => this.findPathToFirst(nOrPair => _.isNumber(nOrPair) && nOrPair >= 10);
  canSplit = () => !!this.findNumberToSplit();
  split = () => {
    const path = this.findPathToFirst(nOrPair => _.isNumber(nOrPair) && nOrPair >= 10);
    const number = this.get(path);
    const splitPair = new Pair(`[${Math.floor(number / 2)},${Math.ceil(number / 2)}]`);
    this.set(path, splitPair);
  };

  findPairToExplode = () =>
    this.findPathToFirst((nOrPair, depth) => nOrPair instanceof Pair && depth >= 4);
  canExplode = () => !!this.findPairToExplode();
  explode = () => {
    const path = this.findPathToFirst((nOrPair, depth) => nOrPair instanceof Pair && depth >= 4);
    const pair = this.get(path);
    const isPairOnTheLeft = _.last(path) === 'x';
    const getAdjacentPath = path => {
      const forkedPath = [..._.initial(path), isPairOnTheLeft ? 'y' : 'x'];
      const pathFromForked = _.isNumber(this.get(forkedPath))
        ? []
        : this.get(forkedPath).findPathToFirst(nOrPair => _.isNumber(nOrPair));
      return [...forkedPath, ...pathFromForked];
    };
    const adjacentPath = getAdjacentPath(path);
    const getNonAdjacentPath = path => {
      let forkedPath = null;
      for (let i = path.length - 1; i >= 0; i--) {
        if (path[i] !== _.last(path)) {
          forkedPath = [...path.slice(0, i), _.last(path)];
          break;
        }
      }
      if (!forkedPath) return null;

      const pathFromForked = _.isNumber(this.get(forkedPath))
        ? []
        : _.last(path) === 'y'
        ? this.get(forkedPath).findPathToFirst(nOrPair => _.isNumber(nOrPair))
        : this.get(forkedPath).findPathToLast(nOrPair => _.isNumber(nOrPair));
      return [...forkedPath, ...pathFromForked];
    };
    const nonAdjacentPath = getNonAdjacentPath(path);
    const newAdjacent = this.get(adjacentPath) + pair[isPairOnTheLeft ? 'y' : 'x'];
    this.set(adjacentPath, newAdjacent);
    if (nonAdjacentPath) {
      this.set(nonAdjacentPath, this.get(nonAdjacentPath) + pair[isPairOnTheLeft ? 'x' : 'y']);
    }
    this.set(path, 0);
  };

  isReduced = () => !(this.canExplode() || this.canSplit());

  reduce = () => {
    // process.stdout.write(chalk.bgWhite(chalk.black('starting reduction\n')));
    // this.log();
    while (this.canExplode() || this.canSplit()) {
      if (this.canExplode()) {
        // process.stdout.write(chalk.red('processing explosion\n'));
        // this.log(this.get(this.findPairToExplode()));
        this.explode();
        // this.log();
      } else if (this.canSplit()) {
        // process.stdout.write(chalk.blue('processing split\n'));
        this.split();
        // this.log();
      }
    }
    // process.stdout.write(chalk.bgWhite(chalk.black('reduction complete\n')));
    return this;
  };

  getMagnitude = () =>
    3 * (_.isNumber(this.x) ? this.x : this.x.getMagnitude()) +
    2 * (_.isNumber(this.y) ? this.y : this.y.getMagnitude());
}

const parse = input => input.split('\n').map(input => new Pair(input));

const processPairsSum = input => {
  const pairs = parse(input);
  return pairs.reduce((accumulator, pair) => {
    const result = accumulator ? new Pair(accumulator, pair) : pair;
    result.reduce();
    return result;
  });
};

const part1 = input => {
  const finalSum = processPairsSum(input);
  return finalSum.getMagnitude();
};

const part2 = input => {
  const allInputsOneWay = input
    .split('\n')
    .flatMap((line, i, arr) => arr.slice(i + 1).map(otherLine => [line, otherLine]));
  const allInputs = allInputsOneWay
    .concat(allInputsOneWay.map(lines => _.reverse(lines)))
    .map(lines => lines.join('\n'));
  const finalSums = allInputs.map(input => part1(input));
  return Math.max(...finalSums);
};

module.exports = { part1, part2, Pair, processPairsSum };
