const { part1, part2, Pair, processPairsSum } = require('./day18');
const input = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

test('Pair class base', () => {
  const pair = new Pair('[1,2]');
  expect(pair.x).toBe(1);
  expect(pair.y).toBe(2);
});

test('Pair class nested y', () => {
  const pair = new Pair('[1,[4,5]]');
  expect(pair.x).toBe(1);
  expect(pair.y.x).toBe(4);
  expect(pair.y.y).toBe(5);
});

test('Pair class nested both', () => {
  const pair = new Pair('[[7,5],[4,5]]');
  expect(pair.x.x).toBe(7);
  expect(pair.x.y).toBe(5);
  expect(pair.y.x).toBe(4);
  expect(pair.y.y).toBe(5);
});

test('Pair class complex parse', () => {
  expect(new Pair('[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]').parse()).toBe(
    '[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]',
  );
});

test('Pair class sum', () => {
  const pair = new Pair('[1,2]');
  const otherPair = new Pair('[[3,4],5]');
  const sum = new Pair(pair, otherPair);
  expect(sum.parse()).toBe('[[1,2],[[3,4],5]]');
});

test('Pair class explode', () => {
  const pair = new Pair('[[[[[9,8],1],2],3],4]');
  pair.explode();
  expect(pair.parse()).toBe('[[[[0,9],2],3],4]');
});

test('Pair class explode 2', () => {
  const pair = new Pair('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]');
  pair.explode();
  expect(pair.parse()).toBe('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]');
});

test('Pair class explode 3', () => {
  const pair = new Pair('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]');
  pair.explode();
  expect(pair.parse()).toBe('[[3,[2,[8,0]]],[9,[5,[7,0]]]]');
});

test('Pair class split', () => {
  const pair = new Pair('[10,11]');
  pair.split();
  expect(pair.parse()).toBe('[[5,5],11]');
  pair.split();
  expect(pair.parse()).toBe('[[5,5],[5,6]]');
});

test('Pair class reduce', () => {
  const pair = new Pair('[[[[4,3],4],4],[7,[[8,4],9]]]');
  const otherPair = new Pair('[1,1]');
  const sum = new Pair(pair, otherPair);
  sum.reduce();
  expect(sum.parse()).toBe('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]');
});

const processPairs_1 = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]`;

test('processPairsSum 1', () => {
  expect(processPairsSum(processPairs_1).parse()).toBe('[[[[3,0],[5,3]],[4,4]],[5,5]]');
});

const processPairs_2 = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`;

test('processPairsSum 2', () => {
  expect(processPairsSum(processPairs_2).parse()).toBe('[[[[5,0],[7,4]],[5,5]],[6,6]]');
});

const processPairs_3 = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`;

test('processPairsSum 3', () => {
  expect(processPairsSum(processPairs_3).parse()).toBe(
    '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]',
  );
});

test('magnitude', () => {
  expect(new Pair('[[1,2],[[3,4],5]]').getMagnitude()).toBe(143);
});

test('magnitude 2', () => {
  expect(new Pair('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]').getMagnitude()).toBe(1384);
});
test('magnitude 3', () => {
  expect(new Pair('[[[[1,1],[2,2]],[3,3]],[4,4]]').getMagnitude()).toBe(445);
});
test('magnitude 4', () => {
  expect(new Pair('[[[[3,0],[5,3]],[4,4]],[5,5]]').getMagnitude()).toBe(791);
});

test('part1', () => {
  expect(part1(input)).toBe(4140);
});

test('part2', () => {
  expect(part2(input)).toBe(3993);
});
