import { useEffect, useRef } from "react";
import * as d3 from "d3";
import Scatterplot from "./Scatterplot";
import Histogram from "./Histogram";
import DataTable from "./DataTable";

let data = d3.csv("https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv");
let scatterplot;
let histogram;
let brushedData;
let dataTable;
let csv;

function updateHistogram() {
  histogram.update(brushedData && brushedData.length > 0 ?
    brushedData : csv, "variety"
  );
}

function updateDataTable() {
  dataTable.update(brushedData && brushedData.length > 0 ?
  brushedData : data, data.columns)
}

export default function Test({count, chosenXVar, chosenYVar, colorUse}) {
  const svgRef = useRef(null);
  const svgRef2 = useRef(null);

  useEffect(() => {
    data.then(csvData => {
        csvData.forEach(d => {
            d["petal.length"] = +d["petal.length"];
            d["petal.width"] = +d["petal.width"];
            d["sepal.length"] = +d["sepal.length"];
            d["sepal.width"] = +d["sepal.width"];
        });
        csv = csvData;
        const svg = d3.select(svgRef.current); // selection 객체
        scatterplot = new Scatterplot(svg, csv);

        svg.selectAll("*").remove()
        
        scatterplot.initialize()

        let xVar; let yVar;
        if (chosenXVar === "SepalLength") xVar = "sepal.length";
        if (chosenXVar === "PetalLength") xVar = "petal.length";
        if (chosenXVar === "SepalWidth") xVar = "sepal.width";
        if (chosenXVar === "PetalWidth") xVar = "petal.width";
        if (chosenYVar === "SepalLength") yVar = "sepal.length";
        if (chosenYVar === "PetalLength") yVar = "petal.length";
        if (chosenYVar === "SepalWidth") yVar = "sepal.width";
        if (chosenYVar === "PetalWidth") yVar = "petal.width";

        scatterplot.update(xVar, yVar, "variety", colorUse);
        scatterplot.on("brush", (brushedItems) => {
          brushedData = brushedItems;
          let svg3 = d3.select(svgRef2.current);
          svg3.selectAll("*").remove();
          
          histogram = new Histogram(svg3);
          histogram.initialize();
          histogram.update(csvData, "variety");

          dataTable = new DataTable("#data-table");
          updateHistogram();
          updateDataTable();
        })

        const svg2 = d3.select(svgRef2.current);
        histogram = new Histogram(svg2);
        histogram.initialize();
        histogram.update(csvData, "variety");

        dataTable = new DataTable("#data-table");
        updateDataTable();
    })
  }, [count, chosenXVar, chosenYVar, colorUse]);

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
      <svg ref={svgRef2}></svg>
    </>
  );
}