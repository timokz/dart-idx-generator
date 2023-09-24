import * as vscode from "vscode";

export function showGraph(): void {
  const panel = vscode.window.createWebviewPanel(
    "graphWebView",
    "File Dependency Graph",
    vscode.ViewColumn.One,
    {}
  );

  panel.webview.html = graphHtmlContent;
  panel.reveal(vscode.ViewColumn.One);
}

const graphHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>File Dependency Graph</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>

<div id="graph-container"></div>

<script>
  const graphData = {
    nodes: [{ id: 'file1' }, { id: 'file2' }, { id: 'file3' }],
    links: [{ source: 'file1', target: 'file2' }, { source: 'file2', target: 'file3' }]
  };

  const width = 500;
  const height = 500;

  const svg = d3.select('#graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.selectAll('line')
    .data(graphData.links)
    .enter().append('line');

  const node = svg.selectAll('circle')
    .data(graphData.nodes)
    .enter().append('circle')
    .attr('r', 5)
    .call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded));

  simulation.nodes(graphData.nodes)
    .on('tick', ticked);

  simulation.force('link')
    .links(graphData.links);

  function ticked() {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
</script>

</body>
</html>
`;
