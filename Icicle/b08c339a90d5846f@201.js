// https://observablehq.com/@d3/icicle@201
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Icicle

This space-filling visualization, the Cartesian equivalent to a [sunburst](/@d3/sunburst), shows the cumulative values of subtrees. It is commonly used to visualize software packages (the size of source code within nested packages) and file systems (the size of files within nested folders). See also the [zoomable version](/@d3/zoomable-icicle).`
)});
  main.variable(observer("chart")).define("chart", ["partition","data","d3","width","height","color","format"], function(partition,data,d3,width,height,color,format)
{
  const root = partition(data);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

  const cell = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y0},${d.x0})`);

  cell.append("rect")
      .attr("width", d => d.y1 - d.y0)
      .attr("height", d => d.x1 - d.x0)
      .attr("fill-opacity", 0.6)
      .attr("fill", d => {
        if (!d.depth) return "#ccc";
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      });

  const text = cell.filter(d => (d.x1 - d.x0) > 16).append("text")
      .attr("x", 4)
      .attr("y", 13);

  text.append("tspan")
      .text(d => d.data.name);

  text.append("tspan")
      .attr("fill-opacity", 0.7)
      .text(d => ` ${format(d.value)}`);

  cell.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3"], function(d3){return(
d3.json("https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json")
)});
  main.variable(observer("partition")).define("partition", ["d3","height","width"], function(d3,height,width){return(
data => d3.partition()
    .size([height, width])
    .padding(1)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value))
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(",d")
)});
  main.variable(observer("width")).define("width", function(){return(
975
)});
  main.variable(observer("height")).define("height", function(){return(
2400
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
