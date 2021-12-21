const { part1, part2, part1WithCustomDetectionArea, Beacon, Scanner } = require('./day19');
const input = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`;

const simpleInput = `--- scanner 0 ---
-1,-1,1
-2,-2,2
-3,-3,3
-2,-3,1
5,6,-4
8,0,7

--- scanner 1 ---
1,-1,1
2,-2,2
3,-3,3
2,-1,3
-5,4,-6
-8,-7,0

--- scanner 2 ---
-1,-1,-1
-2,-2,-2
-3,-3,-3
-1,-3,-2
4,6,5
-7,0,8

--- scanner 3 ---
1,1,-1
2,2,-2
3,3,-3
1,3,-2
-4,-6,5
7,0,8

--- scanner 4 ---
1,1,1
2,2,2
3,3,3
3,1,2
-6,-4,-5
0,7,-8`;

test('Beacon match', () => {
  const beacon1_1 = new Beacon(0, 0, 0);
  const beacon2_1 = new Beacon(1, 1, 1);
  const beacon3_1 = new Beacon(1000, 1000, 1000);
  beacon1_1.addLinkTo(beacon2_1);
  beacon1_1.addLinkTo(beacon3_1);
  beacon2_1.addLinkTo(beacon1_1);
  beacon2_1.addLinkTo(beacon3_1);
  beacon3_1.addLinkTo(beacon1_1);
  beacon3_1.addLinkTo(beacon2_1);

  const beacon1_2 = new Beacon(1, 1, 1);
  const beacon2_2 = new Beacon(2, 2, 2);
  // Third beacon is out of scanner range
  beacon1_2.addLinkTo(beacon2_2);
  beacon2_2.addLinkTo(beacon1_2);

  expect(beacon1_1.matches(beacon1_2)).toBe(true);
  expect(beacon2_1.matches(beacon2_2)).toBe(true);
  expect(beacon1_1.matches(beacon2_2)).toBe(false);
  expect(beacon2_1.matches(beacon1_2)).toBe(false);
  expect(beacon3_1.matches(beacon2_1)).toBe(false);
  expect(beacon3_1.matches(beacon2_2)).toBe(false);
});

test('el que se hace el poronga conmigo, NADIE SE HACE EL PORONGA CONMIGO', () => {
  const scanner1 = new Scanner(0);
  `-1,-2,-1
  -2,-3,-2
  -3,-4,-3
  -1,-4,-2
  4,5,5
  -7,-1,8`
    .split('\n')
    .forEach(line => {
      scanner1.addBeacon(line.trim());
    });
  const scanner2 = new Scanner(1);
  `8,1,1
  9,2,0
  10,3,-1
  8,3,0
  3,-6,7
  14,0,10
  -1000,1000,1000`
    .split('\n')
    .forEach(line => {
      scanner2.addBeacon(line.trim());
    });
  scanner1.calculateRotations();
  scanner2.calculateRotations();

  expect(scanner1.getMatchingRotationIndex(scanner2, 6)).toBe(2);
  expect(scanner2.getMatchingRotationIndex(scanner1, 6)).toBe(2);
  expect(scanner1.getMatchingBeacons(scanner2, 2).length).toBe(6);
  expect(scanner2.getMatchingBeacons(scanner1, 2).length).toBe(6);
  scanner1.buildLinkToScanner(scanner2, 6);
  expect(scanner1.links.length).toBe(1);
  expect(scanner1.links[0].from).toBe(scanner1.key);
  expect(scanner1.links[0].to).toBe(scanner2.key);
  expect(scanner1.links[0].rotationIndex).toBe(2);
  expect(scanner1.links[0].matchingBeacons.length).toBe(6);
  scanner2.buildLinkToScanner(scanner1, 6);
  expect(scanner2.links.length).toBe(1);
  expect(scanner2.links[0].from).toBe(scanner2.key);
  expect(scanner2.links[0].to).toBe(scanner1.key);
  expect(scanner2.links[0].rotationIndex).toBe(2);
  expect(scanner2.links[0].matchingBeacons.length).toBe(6);
});

test('el otro que se hace el poronga conmigo, NADIE SE HACE EL PORONGA CONMIGO DOS VECES', () => {
  const scanner1 = new Scanner(0);
  `404,-588,-901
  528,-643,409
  -838,591,734
  390,-675,-793
  -537,-823,-458
  -485,-357,347
  -345,-311,381
  -661,-816,-575
  -876,649,763
  -618,-824,-621
  553,345,-567
  474,580,667
  -447,-329,318
  -584,868,-557
  544,-627,-890
  564,392,-477
  455,729,728
  -892,524,684
  -689,845,-530
  423,-701,434
  7,-33,-71
  630,319,-379
  443,580,662
  -789,900,-551
  459,-707,401`
    .split('\n')
    .forEach(line => {
      scanner1.addBeacon(line.trim());
    });
  const scanner2 = new Scanner(1);
  `686,422,578
  605,423,415
  515,917,-361
  -336,658,858
  95,138,22
  -476,619,847
  -340,-569,-846
  567,-361,727
  -460,603,-452
  669,-402,600
  729,430,532
  -500,-761,534
  -322,571,750
  -466,-666,-811
  -429,-592,574
  -355,545,-477
  703,-491,-529
  -328,-685,520
  413,935,-424
  -391,539,-444
  586,-435,557
  -364,-763,-893
  807,-499,-711
  755,-354,-619
  553,889,-390`
    .split('\n')
    .forEach(line => {
      scanner2.addBeacon(line.trim());
    });
  scanner1.calculateRotations();
  scanner2.calculateRotations();

  scanner1.buildLinkToScanner(scanner2, 12);
  expect(scanner1.links.length).toBe(1);
  expect(scanner1.links[0].from).toBe(scanner1.key);
  expect(scanner1.links[0].to).toBe(scanner2.key);
  expect(scanner1.links[0].rotationIndex).toBe(4);
  expect(scanner1.links[0].matchingBeacons.length).toBe(12);
  scanner2.buildLinkToScanner(scanner1, 12);
  expect(scanner2.links.length).toBe(1);
  expect(scanner2.links[0].from).toBe(scanner2.key);
  expect(scanner2.links[0].to).toBe(scanner1.key);
  expect(scanner2.links[0].rotationIndex).toBe(4);
  expect(scanner2.links[0].matchingBeacons.length).toBe(12);
});

test('part1 simple', () => {
  expect(part1WithCustomDetectionArea(simpleInput, 6)).toBe(6);
});

test('part1', () => {
  expect(part1(input)).toBe(79);
});

test.only('part2', () => {
  expect(part2(input)).toBe(3621);
});
