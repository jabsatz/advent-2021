const { part1, part2 } = require('./day3');
const input = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

test('part1', () => {
  expect(part1(input)).toBe(198);
});

test('part2', () => {
  expect(part2(input)).toBe(230);
});
