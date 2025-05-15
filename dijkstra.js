// 1. Graph
const graph = {
  A: { B: 2, C: 1 },
  B: { C: 1, D: 6, E: 4 },
  C: { E: 4 },
  D: { E: 5, F: 3 },
  E: { F: 5 },
  F: {},
};

// 2. Dijkstra funktionen
function dijkstra(graph, startNode) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  }

  distances[startNode] = 0;

  while (unvisited.size > 0) {
    let currentNode = null;
    let lowestDistance = Infinity;

    for (const node of unvisited) {
      if (distances[node] < lowestDistance) {
        lowestDistance = distances[node];
        currentNode = node;
      }
    }

    if (currentNode === null) {
      break;
    }

    const neighbors = graph[currentNode];
    for (const neighbor in neighbors) {
      const distance = neighbors[neighbor];
      const newDistance = distances[currentNode] + distance;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentNode;
      }
    }

    unvisited.delete(currentNode);
  }

  return { distances, previous };
}

// 3. Backtracking af korteste rute
function getShortestPath(previous, endNode) {
  const path = [];
  let current = endNode;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}

// 4. Kald af funktionerne for at starte algoritmen
const { distances, previous } = dijkstra(graph, "A");
const pathToF = getShortestPath(previous, "F");

// Logs
console.log("Afstande fra A:", distances);
console.log("Previous nodes:", previous);
console.log("Korteste vej til F:", pathToF);
for (const node in distances) {
  console.log(
    `Node: ${node}, Distance: ${distances[node]}, Parent: ${previous[node]}`
  );
}
