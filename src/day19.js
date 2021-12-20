const _ = require('lodash/fp');

// rotationIndex / 4
const AXIS_SWITCHES = {
  // Unchanged
  0: ([x, y, z]) => [x, y, z],
  // Rotate 180 degrees around the y-axis so z points towards -z
  1: ([x, y, z]) => [-x, y, -z],
  // Rotate 90 degrees around the y-axis so that z points towards -x
  2: ([x, y, z]) => [z, y, -x],
  // Rotate 90 degrees around the y-axis so that z points towards +x
  3: ([x, y, z]) => [-z, y, x],
  // Rotate 90 degrees around the x-axis so that z points towards -y
  4: ([x, y, z]) => [x, z, -y],
  // Rotate 90 degrees around the x-axis so that z points towards +y
  5: ([x, y, z]) => [x, -z, y],
};

// rotationIndex % 4
const ROTATIONS = {
  // Unchanged
  0: ([x, y, z]) => [x, y, z],
  // Rotate 90 degrees around z
  1: ([x, y, z]) => [-y, x, z],
  // Rotate 180 degrees around z
  2: ([x, y, z]) => [-x, -y, z],
  // Rotate 270 degrees around z
  3: ([x, y, z]) => [y, -x, z],
};

// [x,y,z] -> [x, z, -y] -> [-z, x, -y] -> [-z, -y, -x] -> [z, y, -x]

const ROTATION_INDEXES = _.range(0, 24);

const rotationFns = ROTATION_INDEXES.map(rotationIndex =>
  _.flow(AXIS_SWITCHES[Math.floor(rotationIndex / 4)], ROTATIONS[rotationIndex % 4]),
);
const oppositeIndexes = ROTATION_INDEXES.map(i =>
  ROTATION_INDEXES.find(j => rotationFns[j](rotationFns[i]([1, 2, 3])).join(',') === '1,2,3'),
);

// OPPOSITE INDEXES
// {
//   '0': 0,
//   '1': 3,
//   '2': 2,
//   '3': 1,
//   '4': 4,
//   '5': 5,
//   '6': 6,
//   '7': 7,
//   '8': 12,
//   '9': 23,
//   '10': 10,
//   '11': 17,
//   '12': 8,
//   '13': 19,
//   '14': 14,
//   '15': 21,
//   '16': 20,
//   '17': 11,
//   '18': 18,
//   '19': 13,
//   '20': 16,
//   '21': 15,
//   '22': 22,
//   '23': 9
// }
const calculateDirection = (positionA, positionB) => positionB.map((pos, i) => pos - positionA[i]);
const calculateDistance = (positionA, positionB) =>
  Math.sqrt(calculateDirection(positionA, positionB).reduce((sum, pos) => sum + pos ** 2, 0));
const isSameDirection = (dirA, dirB) => dirA.every((pos, i) => pos === dirB[i]);
const advancePosition = (position, direction) => position.map((pos, i) => pos + direction[i]);

class Beacon {
  constructor(...args) {
    let position;
    if (args.length === 3) {
      position = args;
    } else if (args.length === 1 && _.isString(args[0])) {
      position = args[0].split(',').map(Number);
    } else if (args.length === 1 && _.isArray(args[0])) {
      position = args[0];
    }
    this.key = position.join(',');
    this.position = position;
    this.links = [];
  }

  getRotated(rotationIndex) {
    return new Beacon(rotationFns[rotationIndex](this.position));
  }

  matches(otherBeacon) {
    let linksToMatch = this.links.filter(link =>
      advancePosition(otherBeacon.position, link.direction).every(pos => Math.abs(pos) <= 1000),
    );
    otherBeacon.links.forEach(link => {
      const matchingIndex = linksToMatch.findIndex(
        otherLink =>
          isSameDirection(link.direction, otherLink.direction) &&
          link.distance === otherLink.distance,
      );
      if (matchingIndex !== -1) {
        linksToMatch.splice(matchingIndex, 1);
      }
    });
    return linksToMatch.length === 0;
  }

  addLinkTo(beacon) {
    this.links.push({
      beacon,
      direction: calculateDirection(this.position, beacon.position),
      distance: calculateDistance(this.position, beacon.position),
    });
  }
}

class Scanner {
  constructor(key, beacons) {
    this.key = key;
    this.originalBeacons = beacons ?? [];
    this.rotatedMap = [];
    this.links = [];
  }

  addBeacon(coordsLine) {
    const newBeacon = new Beacon(coordsLine);
    this.originalBeacons.forEach(beacon => {
      newBeacon.addLinkTo(beacon);
      beacon.addLinkTo(newBeacon);
    });
    this.originalBeacons.push(newBeacon);
  }

  get beacons() {
    return this.originalBeacons;
  }

  get uniqueBeacons() {
    return this.originalBeacons.filter(beacon =>
      this.links.some(link =>
        link.matchingBeacons.some(matchingBeacon => matchingBeacon.key !== beacon.key),
      ),
    );
  }

  calculateRotations() {
    ROTATION_INDEXES.forEach(rotationIndex => {
      const newBeacons = this.originalBeacons.map(beacon => beacon.getRotated(rotationIndex));
      this.rotatedMap.push([]);
      newBeacons.forEach(newBeacon => {
        this.rotatedMap[rotationIndex].forEach(beacon => {
          newBeacon.addLinkTo(beacon);
          beacon.addLinkTo(newBeacon);
        });
        this.rotatedMap[rotationIndex].push(newBeacon);
      });
    });
  }

  getMatchingBeacons(otherScanner, rotationIndex) {
    const otherBeacons = otherScanner.rotatedMap[rotationIndex];
    let matchingBeacons = [];
    otherBeacons.forEach(otherBeacon => {
      const beaconsLeft = this.originalBeacons.filter(
        originalBeacon =>
          !matchingBeacons.some(matchingBeacon => matchingBeacon.key === originalBeacon.key),
      );
      for (let i = 0; i < beaconsLeft.length; i++) {
        const beacon = beaconsLeft[i];
        if (beacon.matches(otherBeacon)) {
          matchingBeacons.push({ ...beacon, otherPerspective: otherBeacon });
          break;
        }
      }
    });
    return matchingBeacons;
  }

  getMatchingRotationIndex = (otherScanner, minAmount = 12) =>
    ROTATION_INDEXES.find(
      rotationIndex => this.getMatchingBeacons(otherScanner, rotationIndex).length >= minAmount,
    );

  buildLinkToScanner(otherScanner, minAmount = 12) {
    const rotationIndex = this.getMatchingRotationIndex(otherScanner, minAmount);
    if (!_.isNumber(rotationIndex)) return;
    const link = {
      from: this.key,
      to: otherScanner.key,
      rotationIndex,
      matchingBeacons: this.getMatchingBeacons(otherScanner, rotationIndex),
    };
    this.links.push(link);
  }

  relativizeBeaconPositions(
    scanners,
    visited = new Set(),
    rotationFn = rotationFns[0],
    initialPosition = [0, 0, 0],
  ) {
    visited.add(this.key);
    console.log(this.key);
    this.position = initialPosition;
    this.realBeacons = this.originalBeacons.map(beacon => {
      const position = advancePosition(initialPosition, rotationFn(beacon.position));
      return new Beacon(position);
    });
    this.links.forEach(link => {
      if (visited.has(link.to)) return;
      const scanner = scanners.find(scanner => scanner.key === link.to);
      const offset = calculateDirection(
        rotationFn(link.matchingBeacons[0].otherPerspective.position),
        rotationFn(link.matchingBeacons[0].position),
      );
      console.log(link.to, initialPosition, offset);
      const scannerPosition = advancePosition(initialPosition, offset);
      scanner.relativizeBeaconPositions(
        scanners,
        visited,
        _.compose(rotationFn, rotationFns[link.rotationIndex]),
        scannerPosition,
      );
    });
  }
}

const parse = input =>
  input.split('\n\n').map(rawScanner => {
    return rawScanner.split('\n').reduce((scanner, line) => {
      if (!scanner) {
        const key = Number(line.match(/\d+/)[0]);
        return new Scanner(key);
      }
      scanner.addBeacon(line);
      return scanner;
    }, undefined);
  });

const part1WithCustomDetectionArea = (input, minAmount) => {
  const scanners = parse(input);
  scanners.forEach(scanner => scanner.calculateRotations());
  scanners.forEach((scanner, i) =>
    scanners
      .filter((_, j) => i !== j)
      .forEach(otherScanner => scanner.buildLinkToScanner(otherScanner, minAmount)),
  );
  while (scanners.some(s => !s.position)) {
    const scannerToCheck = scanners.find(s => !s.position);
    scannerToCheck.relativizeBeaconPositions(scanners);
  }
  console.log(scanners.map(s => s.links));
  console.log(scanners.map(s => s.position));
  const allBeacons = _.uniqBy(
    b => b.key,
    scanners.flatMap(scanner => scanner.realBeacons ?? []),
  );
  console.log(
    allBeacons
      .sort((a, b) => a.position[0] - b.position[0])
      .map(b => b.key)
      .join('\n'),
  );
  return allBeacons.length;
};

const part1 = input => part1WithCustomDetectionArea(input, 12);

const part2 = input => {
  parse(input);
};

module.exports = { part1, part1WithCustomDetectionArea, part2, parse, Scanner, Beacon };
