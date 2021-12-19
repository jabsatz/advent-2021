const { part1, part2 } = require('./day17');
const input = 'target area: x=20..30, y=-10..-5';

test('part1', () => {
  expect(part1(input)).toBe(45);
});

test('part2', () => {
  expect(part2(input)).toBe(112);
});
