const { part1, part2 } = require('./day7');
const input = '16,1,2,0,4,2,7,1,2,14';

test('part1', () => {
  expect(part1(input)).toBe(37);
});

test('part2', () => {
  expect(part2(input)).toBe(168);
});
