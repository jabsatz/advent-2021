const _ = require('lodash/fp');

class ProbePlotter {
  constructor(input) {
    const [_, x1, x2, y1, y2] = input.match(/x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/).map(Number);
    this.targetArea = {
      minX: Math.min(x1, x2),
      maxX: Math.max(x1, x2),
      minY: Math.min(y1, y2),
      maxY: Math.max(y1, y2),
    };
  }

  getProbeFunction = (initialX, initialY) => step => {
    const xLimit = (initialX * (initialX + 1)) / 2;
    const xToGo = ((initialX - step) * (initialX - step + 1)) / 2;
    return {
      x: step > initialX ? xLimit : xLimit - xToGo,
      y: (initialY * (initialY + 1)) / 2 - ((initialY - step) * (initialY - step + 1)) / 2,
    };
  };

  pointInTargetArea = ({ x, y }) =>
    x <= this.targetArea.maxX &&
    x >= this.targetArea.minX &&
    y <= this.targetArea.maxY &&
    y >= this.targetArea.minY;

  plotPath = (initialX, initialY, length = 20) => {
    const fn = this.getProbeFunction(initialX, initialY);
    const points = _.range(0, length).map(step => fn(step));
    const maxY = Math.max(...points.map(p => p.y), this.targetArea.maxY);
    const minY = Math.min(...points.map(p => p.y), this.targetArea.minY);
    const maxX = Math.max(...points.map(p => p.x), this.targetArea.maxX);
    const minX = Math.min(...points.map(p => p.x), this.targetArea.minX);

    for (let y = maxY; y >= minY; y--) {
      const line = _.range(minX, maxX + 1)
        .map(x =>
          points.find(p => p.x === x && p.y === y)
            ? '#'
            : this.pointInTargetArea({ x, y })
            ? 'T'
            : ' ',
        )
        .join('');
      process.stdout.write(`${line}\n`);
    }
    console.log(maxY);
  };

  // The function of the probe is a triangle number, just like in Day 7 part 2.
  // The X part does not change anymore after reaching it's max value (i.e. it doesn't add negative numbers)
  // We want to find the smallest initial X velocity possible, which would be when X reaches it's max value just after targetArea.minX
  // Since the X part does not add negative numbers, we can use the triangle number formula to see what's the maximum value an initialX velocity would reach:
  // n + (n - 1) + (n - 2) ... + 2 + 1 = n * (n + 1) / 2 =>
  // f(n) =  0.5 * (n ** 2) + 0.5 * n
  // now if we try f(6) for example, we can see the max value X will reach is 21
  //
  // What we want is to calculate the point where f(n) === targetArea.minX
  //
  // targetArea.minX = 0.5 * (n ** 2) + 0.5 * n
  // 0 = 0.5 * (n ** 2) + 0.5 * n - targetArea.minX
  //
  // Now this looks very much like a quadratic function (f(x) = a*x^2 + b*x + c) where the values are
  // a = 0.5, b = 0.5, c = targetArea.minX
  //
  // Then, we can use the quadratic formula to solve this equation: -b +- sqrt(b^2 - 4ac) / 2a.
  // (We discard the negative sqrt because we're only calclulating paths forward, and use Math.ceil() since we only use Integers).
  getSmallestInitialX = () => Math.ceil(Math.sqrt(0.25 + 2 * this.targetArea.minX) - 0.5);

  calculateHighestY = () => {
    const initialX = this.getSmallestInitialX();
    for (let y = 0; true; y++) {
      const fn = this.getProbeFunction(initialX, y);
      let heights = [];
      for (let step = 0; true; step++) {
        const probe = fn(step);
        heights.push(probe.y);
        const nextProbe = fn(step + 1);
        if (probe.y === 0 && nextProbe.y === this.targetArea.minY) {
          // this.plotPath(initialX, y, step + 2);
          return Math.max(...heights);
        }
        if (nextProbe.y < this.targetArea.minY) {
          break;
        }
      }
    }
  };

  calculateAllProbeThrows = () => {
    const minX = this.getSmallestInitialX();
    const maxX = this.targetArea.maxX;
    const minY = this.targetArea.minY;
    const maxY = this.calculateHighestY();
    let probeThrows = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let step = 0; true; step++) {
          const probe = this.getProbeFunction(x, y)(step);
          if (this.pointInTargetArea(probe)) {
            probeThrows.push({ x, y });
            break;
          }
          if (probe.x > this.targetArea.maxX || probe.y < this.targetArea.minY) {
            break;
          }
        }
      }
    }
    return probeThrows;
  };
}

const parse = input => new ProbePlotter(input);

const part1 = input => {
  const probePlotter = parse(input);
  probePlotter.plotPath(11, -5, 5);
  return probePlotter.calculateHighestY();
};

const part2 = input => {
  const probePlotter = parse(input);
  const probeThrows = probePlotter.calculateAllProbeThrows();
  return probeThrows.length;
};

module.exports = { part1, part2 };
