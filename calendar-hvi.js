// calendar-hvi.js
(function () {
  const width = 900, height = 150;
  const cellSize = 17;

  const svg = d3.select("#d3-container-1")
    .append("svg")
    .attr("width", width)
    .attr("height", height + 40)
    .append("g")
    .attr("transform", "translate(40,20)");

  const format = d3.timeParse("%Y-%m-%d");
  const color = d3.scaleSequential(d3.interpolateYlGnBu).domain([1, 5]);

  d3.csv("calendar-hvi.csv").then(data => {
    data.forEach(d => {
      d.date = format(d.date);
      d.value = +d.value;
    });

    const day = d => (d.getDay() + 6) % 7;

    svg.selectAll(".day")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", d => d3.timeWeek.count(d3.timeYear(d.date), d.date) * cellSize)
      .attr("y", d => day(d.date) * cellSize)
      .attr("fill", d => color(d.value))
      .append("title")
      .text(d => `${d3.timeFormat("%B %d")(d.date)}: ${d.value}`);
  });
})();