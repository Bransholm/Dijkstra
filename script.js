import {
  drawGraph,
  updateEdgeLabels,
  updateTable,
  highlightCurrent,
  highlightNeighbor,
  markVisited,
  unhighlight,
  highlightShortestPath,
} from "./visual.js";

// 1. Graph
const graph = {
  A: { B: 2, C: 1 },
  B: { C: 1, D: 6, E: 4 },
  C: { E: 4 },
  D: { E: 5, F: 3 },
  E: { F: 5 },
  F: {},
};

// 2. Variabler til flow
let distances = {};
let previous = {};
let unvisited = new Set();
let currentNode = null;
let neighbors = {};
let neighborKeys = [];
let currentNeighborIndex = 0;
let currentStep = "init";

// 3. Initier Dijkstra
function startDijkstra(startNode) {
  distances = {};
  previous = {};
  unvisited = new Set();

  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  }

  distances[startNode] = 0;
  drawGraph(graph);
  updateEdgeLabels(graph);
  updateTable(distances, previous);

  currentStep = "selectNode";
  currentNeighborIndex = 0;
}

// 4. Step-funktion styret af if/else
function nextStep() {
  if (currentStep === "selectNode") {
    if (unvisited.size === 0) {
      currentStep = "done";
      return;
    }

    let lowestDistance = Infinity;
    currentNode = null;

    for (const node of unvisited) {
      if (distances[node] < lowestDistance) {
        lowestDistance = distances[node];
        currentNode = node;
      }
    }

    if (currentNode === null) {
      currentStep = "done";
      return;
    }

    highlightCurrent(currentNode);
    neighbors = graph[currentNode];
    neighborKeys = Object.keys(neighbors);
    currentNeighborIndex = 0;
    currentStep = "neighbor-highlight";
    return;
  }

  if (currentStep === "neighbor-highlight") {
    if (currentNeighborIndex < neighborKeys.length) {
      const neighbor = neighborKeys[currentNeighborIndex];
      highlightNeighbor(neighbor);
      currentStep = "neighbor-update";
      return;
    } else {
      unvisited.delete(currentNode);
      markVisited(currentNode);
      unhighlight(currentNode);
      currentStep = "selectNode";
      return;
    }
  }

  if (currentStep === "neighbor-update") {
    const neighbor = neighborKeys[currentNeighborIndex];
    const alt = distances[currentNode] + neighbors[neighbor];
    if (alt < distances[neighbor]) {
      distances[neighbor] = alt;
      previous[neighbor] = currentNode;
    }

    updateTable(distances, previous);
    unhighlight(neighbor);
    currentNeighborIndex++;
    currentStep = "neighbor-highlight";
    return;
  }

  if (currentStep === "done") {
    highlightShortestPath(previous, "F");
  }
}

// 5. Knapper
document.getElementById("start-btn").addEventListener("click", () => {
  startDijkstra("A");
});

document.getElementById("next-btn").addEventListener("click", () => {
  nextStep();
});
