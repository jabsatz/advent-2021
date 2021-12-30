const { part1, part2, ALU } = require("./day24");
const input = "";

test("ALU1", () => {
  const alu = new ALU();
  alu.runWithInputs(["inp x", "mul x -1"], [1]);
  expect(alu.x).toBe(-1);

  alu.clear();
  alu.runWithInputs(["inp x", "mul x -1"], [-47]);
  expect(alu.x).toBe(47);
});

test("ALU2", () => {
  const alu = new ALU();
  const instructions = ["inp z", "inp x", "mul z 3", "eql z x"];
  alu.runWithInputs(instructions, [3, 9]);
  expect(alu.z).toBe(1);

  alu.clear();
  alu.runWithInputs(instructions, [9, 12]);
  expect(alu.z).toBe(0);
});

test("ALU3", () => {
  const alu = new ALU();
  const instructions = [
    "inp w",
    "add z w",
    "mod z 2",
    "div w 2",
    "add y w",
    "mod y 2",
    "div w 2",
    "add x w",
    "mod x 2",
    "div w 2",
    "mod w 2",
  ];
  alu.runWithInputs(instructions, [15]);
  expect(alu.z).toBe(1);
  expect(alu.y).toBe(1);
  expect(alu.x).toBe(1);
  expect(alu.w).toBe(1);

  alu.clear();
  alu.runWithInputs(instructions, [4]);
  expect(alu.z).toBe(0);
  expect(alu.y).toBe(0);
  expect(alu.x).toBe(1);
  expect(alu.w).toBe(0);
});

test("part1", () => {
  expect(part1(input)).toBe(output);
});

test("part2", () => {
  expect(part2(input)).toBe(output);
});
