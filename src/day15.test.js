const { part1, part2 } = require('./day15');
const input = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

test('part1', () => {
  expect(part1(input)).toBe(40);
});

test('part2', () => {
  expect(part2(input)).toBe(315);
});
