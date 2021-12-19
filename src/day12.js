const _ = require('lodash/fp');

const parse = input => {
  let graph = {};
  input.split('\n').forEach(line => {
    const [from, to] = line.split('-');

    if (!graph[from]) graph[from] = { key: from, edges: [] };
    if (!graph[to]) graph[to] = { key: to, edges: [] };

    graph[from].edges.push({ from, to });
    graph[to].edges.push({ from: to, to: from });
  });
  return graph;
};

const canVisitMultipleTimes = key => key === key.toUpperCase();

const getDifferentPaths = graph => {
  let queue = [{ ...graph.start, path: ['start'] }];
  let pathsToEnd = new Set();
  while (queue.length > 0) {
    const node = queue.shift();
    if (node.key === 'end') {
      pathsToEnd.add(node.path);
    } else {
      node.edges.forEach(edge => {
        if (!node.path.includes(edge.to) || canVisitMultipleTimes(edge.to)) {
          queue.push({
            ...graph[edge.to],
            path: [...node.path, edge.to],
          });
        }
      });
    }
  }
  return pathsToEnd;
};

const getDifferentPathsPart2 = graph => {
  let queue = [{ ...graph.start, path: ['start'], hasVisitedTwice: false }];
  let pathsToEnd = new Set();
  const dfs = node => {
    if (node.key === 'end') {
      pathsToEnd.add(node.path.join(','));
    } else {
      node.edges.forEach(edge => {
        const isPermittedDoubleVisit =
          !canVisitMultipleTimes(edge.to) &&
          !node.hasVisitedTwice &&
          node.path.includes(edge.to) &&
          !['start', 'end'].includes(edge.to);
        if (
          !node.path.includes(edge.to) ||
          canVisitMultipleTimes(edge.to) ||
          isPermittedDoubleVisit
        ) {
          dfs({
            ...graph[edge.to],
            path: [...node.path, edge.to],
            hasVisitedTwice: node.hasVisitedTwice || isPermittedDoubleVisit,
          });
        }
      });
    }
  };
  dfs({ ...graph.start, path: ['start'], hasVisitedTwice: false });
  return pathsToEnd;
};

const part1 = input => {
  const graph = parse(input);
  const differentPaths = getDifferentPaths(graph);

  return differentPaths.size;
};

const part2 = input => {
  const graph = parse(input);
  const differentPaths = getDifferentPathsPart2(graph);

  return differentPaths.size;
};

module.exports = { part1, part2 };
