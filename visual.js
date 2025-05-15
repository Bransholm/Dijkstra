const nodePositions = {
  A: { x: 100, y: 100 },
  B: { x: 300, y: 100 },
  C: { x: 100, y: 250 },
  D: { x: 500, y: 100 },
  E: { x: 300, y: 250 },
  F: { x: 500, y: 250 },
};

const svg = document.getElementById("graph");
const tableBody = document.querySelector("#dijkstra-table tbody");

export function drawGraph(graph) {
  svg.innerHTML = "";

  for (const from in graph) {
    for (const to in graph[from]) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", nodePositions[from].x);
      line.setAttribute("y1", nodePositions[from].y);
      line.setAttribute("x2", nodePositions[to].x);
      line.setAttribute("y2", nodePositions[to].y);
      line.setAttribute("id", `edge-${from}-${to}`);
      svg.appendChild(line);
    }
  }

  for (const node in nodePositions) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", nodePositions[node].x);
    circle.setAttribute("cy", nodePositions[node].y);
    circle.setAttribute("r", 25);
    circle.setAttribute("id", `node-${node}`);
    svg.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", nodePositions[node].x);
    text.setAttribute("y", nodePositions[node].y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dy", ".3em");
    text.textContent = node;
    svg.appendChild(text);
  }
}

export function updateEdgeLabels(graph) {
  for (const from in graph) {
    for (const to in graph[from]) {
      const x = (nodePositions[from].x + nodePositions[to].x) / 2;
      const y = (nodePositions[from].y + nodePositions[to].y) / 2 - 10;

      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

      // Justér dx for specifikke forbindelser
      let dx = 0;
      const edgeId = `${from}-${to}`;
      const reverseId = `${to}-${from}`;
      if (
        edgeId === "A-C" ||
        reverseId === "A-C" ||
        edgeId === "B-E" ||
        reverseId === "B-E" ||
        edgeId === "D-F" ||
        reverseId === "D-F"
      ) {
        dx = -10;
      }

      label.setAttribute("x", x + dx);
      label.setAttribute("y", y);
      label.setAttribute("text-anchor", "middle");
      label.textContent = graph[from][to];
      svg.appendChild(label);
    }
  }
}

export function updateTable(distances, previous) {
  tableBody.innerHTML = "";
  for (const node in distances) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${node}</td>
            <td>${distances[node]}</td>
            <td>${previous[node] ?? ""}</td>
          `;
    tableBody.appendChild(row);
  }
}

export function highlightCurrent(node) {
  document.querySelectorAll("circle").forEach((circle) => {
    circle.classList.remove("node-current");
  });
  document.getElementById(`node-${node}`).classList.add("node-current");
}

export function highlightNeighbor(node) {
  document.getElementById(`node-${node}`).classList.add("node-neighbor");
}

export function markVisited(node) {
  document.getElementById(`node-${node}`).classList.add("node-visited");
}

export function unhighlight(node) {
  const element = document.getElementById(`node-${node}`);
  element.classList.remove("node-current");
  element.classList.remove("node-neighbor");
}

export function highlightShortestPath(previous, endNode) {
  let current = endNode;
  while (previous[current]) {
    const from = previous[current];
    const edge =
      document.getElementById(`edge-${from}-${current}`) ||
      document.getElementById(`edge-${current}-${from}`);
    if (edge) edge.classList.add("edge-shortest");
    current = from;
  }
}
