const { part1, part2 } = require('./day14');
const input = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

test('part1', () => {
  expect(part1(input)).toBe(1588);
});

test('part2', () => {
  expect(part2(input)).toBe(2188189693529);
});
