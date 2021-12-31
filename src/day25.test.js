const { part1, part2 } = require("./day25");
const input = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;

test("part1", () => {
  expect(part1(input)).toBe(58);
});
