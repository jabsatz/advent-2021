const {
  part1,
  part2,
  BurrowChart,
  getMovableAmphipods,
  getTargetsFromPos,
} = require("./day23");
const input = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

test.skip("getMovableAmphipods", () => {
  const chart = new BurrowChart(`#############
#A..........#
###.#D#B#D###
  #A#B#C#C#
  #########`);
  console.log(getMovableAmphipods(chart));
  console.log(getTargetsFromPos(chart, [1, 1]));
});

test.skip("isSolved", () => {
  const chart = new BurrowChart(`#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########`);
  expect(chart.isSolved()).toBe(true);
});

test.skip("isSolved", () => {
  const chart = new BurrowChart(`#############
#A..........#
###.#B#C#D###
  #A#B#C#D#
  #########`);
  expect(chart.isSolved()).toBe(false);
});

test("part1", () => {
  expect(part1(input)).toBe(12521);
});

test.skip("part2", () => {
  expect(part2(input)).toBe(output);
});
