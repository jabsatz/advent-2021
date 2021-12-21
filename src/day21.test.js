const { part1, part2 } = require('./day21');
const input = `Player 1 starting position: 4
Player 2 starting position: 8`;

test('part1', () => {
  expect(part1(input)).toBe(739785);
});

test('part2', () => {
  expect(part2(input)).toBe(444356092776315);
});
