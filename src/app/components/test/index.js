import { useEffect, useRef } from "react";
import * as d3 from "d3";

let width = 400, height = 400;
let margin = {top: 10, right: 10, bottom: 40, left: 40}
let data = d3.csv("https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv");

export default function Test({count, chosenXVar, chosenYVar, colorUse}) {
  const svgRef = useRef(null);

  useEffect(() => {
    data.then(csvData => {
        csvData.forEach(d => {
            d["petal.length"] = +d["petal.length"];
            d["petal.width"] = +d["petal.width"];
            d["sepal.length"] = +d["sepal.length"];
            d["sepal.width"] = +d["sepal.width"];
        });
        let csv = csvData;
        const svg = d3.select(svgRef.current); // selection 객체
        svg.selectAll("*").remove()
        let container = svg.append("g");
        let gXAxis = svg.append("g");
        let gYAxis = svg.append("g");

        svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        let xVar; let yVar;
        if (chosenXVar === "SepalLength") xVar = "sepal.length";
        if (chosenXVar === "PetalLength") xVar = "petal.length";
        if (chosenXVar === "SepalWidth") xVar = "sepal.width";
        if (chosenXVar === "PetalWidth") xVar = "petal.width";
        if (chosenYVar === "SepalLength") yVar = "sepal.length";
        if (chosenYVar === "PetalLength") yVar = "petal.length";
        if (chosenYVar === "SepalWidth") yVar = "sepal.width";
        if (chosenYVar === "PetalWidth") yVar = "petal.width";
        
        let xScale = d3.scaleLinear().domain(d3.extent(csv, d => d[xVar])
        ).range([0, width]);
        let yScale = d3.scaleLinear().domain(d3.extent(csv, d => d[yVar])
        ).range([height, 0]);
        let zScale = d3.scaleOrdinal().domain(["Setosa", "Versicolor", "Virginica"]).range(d3.schemeCategory10)
        

        container.attr("transform", `translate(${margin.left}, ${margin.top})`)
        gXAxis
            .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
            .transition()
            .call(d3.axisBottom(xScale))
        gYAxis
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .transition()
            .call(d3.axisLeft(yScale))

        container
          .selectAll("circle")
          .data(csv)
          .join(
            (enter) => enter.append("circle"),
            (update) => update.attr("class", "updated"),
            (exit) => exit.transition().duration(500).attr("opacity", 0).remove()
          )
          .transition()
          .attr("r", 3)
          .attr("cx", d => xScale(d[xVar]))
          .attr("cy", d => yScale(d[yVar]))
          .attr("fill", d => zScale(d.variety))
        })
  }, [count]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    console.log(colorUse)
    if (colorUse) {
        let zScale = d3.scaleOrdinal().domain(["Setosa", "Versicolor", "Virginica"]).range(d3.schemeCategory10)
        svg.selectAll("circle")
          .attr("fill", d => zScale(d.variety))
    } else {
        svg.selectAll("circle")
            .attr("fill", "white");
    }
  }, [colorUse]) 
  return (
    <>        
      <svg ref={svgRef}></svg>
    </>
  );
}