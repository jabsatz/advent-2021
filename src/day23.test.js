const { part1, part2 } = require("./day23");
const input = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

test("part1", () => {
  expect(part1(input)).toBe(12521);
});

test.skip("part2", () => {
  expect(part2(input)).toBe(output);
});
