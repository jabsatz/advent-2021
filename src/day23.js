const _ = require("lodash/fp");

const ENERGY_COST = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

class BurrowChart {
  constructor(input) {
    this.rawChart = input.split("\n").map((line) => line.split(""));
    this.boundaries = [this.rawChart[0].length - 1, this.rawChart.length - 1];
    this.nodes = this.buildGraph();
    this.energySpent = 0;
  }

  buildGraph = () => {
    let nodes = {};
    ["1,1", "2,1", "4,1", "6,1", "8,1", "10,1", "11,1"].forEach(
      (key, i, arr) => {
        const pos = key.split(",").map(Number);
        nodes[key] = { key, pos, amphipod: null, target: null, edges: [] };
        if (i > 0) {
          nodes[key].edges.push({
            from: key,
            to: arr[i - 1],
            distance: pos[0] - Number(arr[i - 1].split(",")[0]),
          });
        }
        if (i < arr.length - 1) {
          nodes[key].edges.push({
            from: key,
            to: arr[i + 1],
            distance: Number(arr[i + 1].split(",")[0]) - pos[0],
          });
        }
      }
    );
    for (let x = 3; x <= 9; x += 2) {
      for (let y = 2; this.get([x, y]) !== "#"; y++) {
        const key = `${x},${y}`;
        nodes[key] = {
          key,
          pos: [x, y],
          amphipod: this.get([x, y]),
          target: { 3: "A", 5: "B", 7: "C", 9: "D" }[x],
          edges: [],
        };
        if (y === 2) {
          nodes[key].edges.push(
            { from: key, to: `${x - 1},1`, distance: 2 },
            { from: key, to: `${x + 1},1`, distance: 2 }
          );
        } else {
          nodes[key].edges.push({
            from: key,
            to: `${x},${y - 1}`,
            distance: 1,
          });
        }
        if (this.get([x, y + 1]) !== "#") {
          nodes[key].edges.push({
            from: key,
            to: `${x},${y + 1}`,
            distance: 1,
          });
        }
      }
    }
    return nodes;
  };

  keyFrom = ([x, y]) => `${x}, ${y}`;

  get = ([x, y]) => this.rawChart[y][x];

  getAmphipod = (pos) => {
    const result = this.get(pos);
    if (["A", "B", "C", "D"].includes(result)) return result;
    return null;
  };

  getPathDijkstra = (startPos, endPos) => {
    const endKey = this.keyFrom(endPos);
    const buildQueueEntry = (pos, prevEntry) => ({
      key: this.keyFrom(pos),
      pos,
      routes: this.getAdjacents(pos),
      ...(prevEntry
        ? {
            distance: prevEntry.distance + 1,
            via: prevEntry.key,
          }
        : { distance: 0 }),
    });
    let queue = [buildQueueEntry(startPos)];
    let visited = {};
    while (queue.length > 0) {
      const entry = queue.shift();
      visited[entry.key] = entry;
      if (entry.key === endKey) {
        break;
      }

      entry.routes.forEach((pos) => {
        if (visited[this.keyFrom(pos)]) return;
        const newEntry = buildQueueEntry(pos, entry);
        const existingEntryIndex = queue.findIndex(
          (entry) => entry.key === newEntry.key
        );
        if (existingEntryIndex === -1) {
          queue.push(newEntry);
        } else if (newEntry.distance < queue[existingEntryIndex].distance) {
          queue[existingEntryIndex] = newEntry;
        }
      });
      queue = _.sortBy((entry) => entry.distance, queue);
    }
    let path = [visited[endKey]];
    while (path[0].via) {
      path.unshift(visited[path[0].via]);
    }
    return path;
  };

  moveAmphipod = (from, to) => {
    const path = this.getPathDijkstra(from, to);
    console.log(path);
  };
}

const parse = (input) => new BurrowChart(input);

const part1 = (input) => {
  const burrowChart = parse(input);
  console.log(burrowChart.nodes);
  // burrowChart.moveAmphipod([3, 2], [1, 1]);
};

const part2 = (input) => {
  parse(input);
};

module.exports = { part1, part2 };
