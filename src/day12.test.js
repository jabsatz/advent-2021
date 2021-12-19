const { part1, part2 } = require('./day12');
const input = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;
const input2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;
const input3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;
const input4 = `CI-hb
IK-lr
vr-tf
lr-end
XP-tf
start-vr
lr-io
hb-qi
end-CI
tf-YK
end-YK
XP-lr
XP-vr
lr-EU
tf-CI
EU-vr
start-tf
YK-hb
YK-vr
start-EU
lr-CI
hb-XP
XP-io
tf-EU`;

test('part1', () => {
  expect(part1(input)).toBe(10);
});

test('part2', () => {
  expect(part2(input)).toBe(36);
});
test('part2 input 2', () => {
  expect(part2(input2)).toBe(103);
});
test('part2 input 3', () => {
  expect(part2(input3)).toBe(3509);
});
