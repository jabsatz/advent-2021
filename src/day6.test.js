const { part1, part2 } = require('./day6');
const input = '3,4,3,1,2';

test('part1', () => {
  expect(part1(input)).toBe(5934);
});

test('part2', () => {
  expect(part2(input)).toBe(26984457539);
});
