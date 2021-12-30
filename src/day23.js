const _ = require("lodash/fp");

class BurrowChart {
  constructor(input) {
    this.rawChart = input.split("\n").map((line) => line.split(""));
    this.boundaries = [this.rawChart[0].length - 1, this.rawChart.length - 1];
    this.nodes = this.buildGraph();
    this.energySpent = 0;
  }
  keyFrom = ([x, y]) => `${x}, ${y}`;

  buildGraph = () => {
    const start = { key: this.keyFrom([1, 1]), pos: [1, 1] }; // Maybe de-hardcode later
    let rawNodes = {};
    let queue = [start];
    let visited = new Set();
    while (queue.length > 0) {
      const node = queue.shift();
      const adjacents = this.getAdjacents(node.pos);
      visited.add(node.key);
      rawNodes[node.key] = {
        ...node,
        amphipod: this.getAmphipod(node.pos),
        edges: adjacents.map((pos) => ({
          to: this.keyFrom(pos),
          pos,
          distance: 1,
        })),
      };
      adjacents.forEach((pos) => {
        const key = this.keyFrom(pos);
        if (visited.has(key)) {
          return;
        }
        queue.push({ key, pos });
      });
    }
    let nodes = {};
    Object.entries(rawNodes).forEach(([key, node]) => {
      if (node.edges.length === 3) return;
      let newEdges = [];
      node.edges.forEach((edge) => {
        if (rawNodes[edge.to].edges.length === 3) {
          newEdges.push(
            ...rawNodes[edge.to].edges
              .filter((edge) => edge.to === key)
              .map((edge) => ({ ...edge, distance: 2 }))
          );
        } else {
          newEdges.push(edge);
        }
      });
      nodes[key] = {
        ...node,
        edges: newEdges.map((e) => ({ ...e, from: key })),
      };
    });
    return nodes;
  };

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

  isInChart = ([x, y]) =>
    x >= 0 && x <= this.boundaries[0] && y >= 0 && y <= this.boundaries[1];

  canStep = ([x, y]) =>
    this.isInChart([x, y]) &&
    [".", "A", "B", "C", "D"].includes(this.get([x, y]));

  getAdjacents = ([x, y]) =>
    [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(this.canStep);
}

const parse = (input) => new BurrowChart(input);

const part1 = (input) => {
  const burrowChart = parse(input);
  burrowChart.moveAmphipod([3, 2], [1, 1]);
};

const part2 = (input) => {
  parse(input);
};

module.exports = { part1, part2 };
