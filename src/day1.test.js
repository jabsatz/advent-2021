const { part1, part2 } = require('./day1');
const input = '199\n200\n208\n210\n200\n207\n240\n269\n260\n263';

test('part1', () => {
  expect(part1(input)).toBe(7);
});

test('part2', () => {
  expect(part2(input)).toBe(5);
});
