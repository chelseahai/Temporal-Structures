// radial-hvi.js
(function () {
  const width = 500, height = 500, innerRadius = 50, outerRadius = 200;
  const svg = d3.select("#d3-container-2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(["10465", "10310", "11203"])
    .range(["#7BAFD4", "#A6CADD", "#D8B7DD"]);

  d3.csv("radial-hvi.csv").then(data => {
    data.forEach(d => {
      d.month = d3.timeParse("%Y-%m")(d.month);
      d.value = +d.value;
    });

    const months = d3.timeMonth.range(new Date(2020, 0), new Date(2021, 0));
    const angle = d3.scaleTime().domain(d3.extent(months)).range([0, 2 * Math.PI]);
    const radius = d3.scaleLinear().domain([1, 5]).range([innerRadius, outerRadius]);

    const line = d3.lineRadial()
      .angle(d => angle(d.month))
      .radius(d => radius(d.value));

    const nested = d3.group(data, d => d.zip_code);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -220)
      .style("font-size", "16px")
      .text("Monthly HVI by ZIP (Radial)");

    svg.selectAll(".zip-line")
      .data(nested)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 2)
      .attr("d", d => line(d[1]));
  });
})();