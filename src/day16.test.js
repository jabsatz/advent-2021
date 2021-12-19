const { part1, part2 } = require('./day16');
const test1_1 = ['8A004A801A8002F478', 16];
const test1_2 = ['620080001611562C8802118E34', 12];
const test1_3 = ['C0015000016115A2E0802F182340', 23];
const test1_4 = ['A0016C880162017C3686B18A3D4780', 31];

const test2_1 = ['C200B40A82', 3];
const test2_2 = ['04005AC33890', 54];
const test2_3 = ['880086C3E88112', 7];
const test2_4 = ['CE00C43D881120', 9];
const test2_5 = ['D8005AC2A8F0', 1];
const test2_6 = ['F600BC2D8F', 0];
const test2_7 = ['9C005AC2F8F0', 0];
const test2_8 = ['9C0141080250320F1802104A08', 1];

test('part1-1', () => {
  const [input, output] = test1_1;
  expect(part1(input)).toBe(output);
});

test('part1-2', () => {
  const [input, output] = test1_2;
  expect(part1(input)).toBe(output);
});

test('part1-3', () => {
  const [input, output] = test1_2;
  expect(part1(input)).toBe(output);
});

test('part1-4', () => {
  const [input, output] = test1_2;
  expect(part1(input)).toBe(output);
});

test('part2_1', () => {
  const [input, output] = test2_1;
  expect(part2(input)).toBe(output);
});
test('part2_2', () => {
  const [input, output] = test2_2;
  expect(part2(input)).toBe(output);
});
test('part2_3', () => {
  const [input, output] = test2_3;
  expect(part2(input)).toBe(output);
});
test('part2_4', () => {
  const [input, output] = test2_4;
  expect(part2(input)).toBe(output);
});
test('part2_5', () => {
  const [input, output] = test2_5;
  expect(part2(input)).toBe(output);
});
test('part2_6', () => {
  const [input, output] = test2_6;
  expect(part2(input)).toBe(output);
});
test('part2_7', () => {
  const [input, output] = test2_7;
  expect(part2(input)).toBe(output);
});
test('part2_8', () => {
  const [input, output] = test2_8;
  expect(part2(input)).toBe(output);
});
