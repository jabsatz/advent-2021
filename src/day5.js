const _ = require('lodash/fp');

const parse = input =>
  input.split('\n').map(line => line.split(' -> ').map(coord => coord.split(',').map(Number)));

const getPointsInLine = ([start, end]) => {
  const [startX, startY] = start;
  const [endX, endY] = end;
  const points = [];
  if (startX === endX) {
    for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
      points.push([startX, y]);
    }
  } else {
    const slope = (endY - startY) / (endX - startX);
    const b = startY - slope * startX;
    for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
      const y = slope * x + b;
      points.push([x, y]);
    }
  }
  return points;
};

const getMatchingPoints = ventLines =>
  ventLines.reduce((matchingPoints, line) => {
    const points = getPointsInLine(line);
    points.forEach(point => {
      const key = point.join(',');
      matchingPoints[key] = matchingPoints[key] ? matchingPoints[key] + 1 : 1;
    });
    return matchingPoints;
  }, {});

const getOverlappingAmounts = matchingPoints =>
  Object.values(matchingPoints).reduce((acc, curr) => (curr >= 2 ? acc + 1 : acc), 0);

const part1 = input => {
  const ventLines = parse(input);
  const straightVentLines = ventLines.filter(
    line => line[0][0] === line[1][0] || line[0][1] === line[1][1],
  );
  const matchingPoints = getMatchingPoints(straightVentLines);
  return getOverlappingAmounts(matchingPoints);
};

const part2 = input => {
  const ventLines = parse(input);
  const matchingPoints = getMatchingPoints(ventLines);
  return getOverlappingAmounts(matchingPoints);
};

module.exports = { part1, part2 };
