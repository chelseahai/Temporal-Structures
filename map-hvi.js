// map-hvi.js
(function () {
  const width = 600, height = 400;
  const svg = d3.select("#d3-container-3")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoMercator().center([-73.94, 40.70]).scale(25000).translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);

  const color = d3.scaleSequential(d3.interpolateOrRd).domain([1, 5]);

  Promise.all([
    d3.json("nyc-zipcodes.geojson"),
    d3.csv("zip-hvi.csv")
  ]).then(([geojson, hvi]) => {
    const hviMap = new Map(hvi.map(d => [d.zip_code, +d.hvi_2020]));

    svg.append("g")
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => color(hviMap.get(d.properties.ZIPCODE) || 0))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .append("title")
      .text(d => `ZIP ${d.properties.ZIPCODE}: HVI ${hviMap.get(d.properties.ZIPCODE)}`);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("2020 Heat Vulnerability Index by NYC ZIP");
  });
})();