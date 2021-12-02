const { part1, part2 } = require('./day2');
const input = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

test('part1', () => {
  expect(part1(input)).toBe(150);
});

test('part2', () => {
  expect(part2(input)).toBe(900);
});
