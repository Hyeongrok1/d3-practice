import { useEffect, useState } from "react";
import * as d3 from "d3";
import Scatterplot from "./Scatterplot";
import Histogram from "./Histogram";
// import {getCosineSimilarity } from "../explain";
import { get_average_cosine_similarity } from './static';

let scatterplot;
let histogram1;
let histogram2;
let histogram3;
let features;

export default function Visual({count}) {
  const [data, setData] = useState(null);
  useEffect(() => {
      const fetchData = async () => {
          try {
              const result = await get_average_cosine_similarity();
              console.log("Fetched Data:", result);
              setData(result); 
          } catch (error) {
              console.error("Error: fetch failed", error);
              setData(null); 
          }
      }; 
      fetchData();
  }, []); 
  useEffect(() => {
    if (!data) return;

        features = data.features;
        d3.select("#sae_id").text("SAE ID: " + data.sae_id);
        const svg = d3.select("#scatterplot");
        const svg2 = d3.select("#histogram1");
        const svg3 = d3.select("#histogram2");
        const svg4 = d3.select("#histogram3");

        scatterplot = new Scatterplot(svg, features);

        svg.selectAll("*").remove();
        svg2.selectAll("*").remove();
        svg3.selectAll("*").remove();
        svg4.selectAll("*").remove();
        d3.select("#feature_x").text("X: feature_id");
        d3.select("#cosine_y").text("Y: cosine_similarity");
        d3.select("#x_llm").text("");
        d3.select("#y_llm").text("");
        d3.select("#z_llm").text("");
        d3.select("#x_text").text("");
        d3.select("#y_text").text("");
        d3.select("#z_text").text("");
        
        scatterplot.initialize()

        let xVar = "feature_id"; let yVar = "cosine_average";

        scatterplot.update(xVar, yVar);

        histogram1 = new Histogram(svg2);
        histogram1.initialize();

        histogram2 = new Histogram(svg3);
        histogram2.initialize();
        
        histogram3 = new Histogram(svg4);
        histogram3.initialize();
    
  }, [data, count]);

  return (
    <>        
    <div class="row pt-2 align-items-center">
        <svg width="300" height="300" id="scatterplot"></svg>
    </div>
    <div class="row pt-2">
        <div className="row pt-2">
            <div className="col-auto pe-2"><strong id="feature_id" className="fs-6">feature id</strong></div>
            <div className="col"></div> 
        </div> 
        <div className="row pt-2">
            <div className="col-auto pe-2"><strong id="cosine_similarity" className="fs-6">cosine similarity</strong></div>
            <div className="col"></div> 
        </div> 
        <br></br>
        <div class="row pt-2 align-items-start">
            <div class="col-4">
                <svg width="400" height="400" id="histogram1"></svg>
            </div>
            <div class="col-7">
                <div className="pe-2 text-start">
                    <strong id="x_llm" className="fs-4">x_llm_value</strong>
                    <strong id="x_score" className="fs-6"></strong>
                    <br></br>
                    <strong id="x_text" className="fs-6">x_text_value</strong>
                </div>
            </div>
        </div>

        <div class="row pt-2 align-items-start">
            <div class="col-4">
                <svg width="400" height="400" id="histogram2"></svg>
            </div>
            <div class="col-7">
                <div className="pe-2 text-start">
                    <strong id="y_llm" className="fs-4">y_llm_value</strong>
                    <strong id="y_score" className="fs-6"></strong>
                    <br></br>
                    <strong id="y_text" className="fs-6">y_text_value</strong>
                </div>
            </div>
        </div>

        <div class="row pt-2 align-items-start">
            <div class="col-4">
                <svg width="400" height="400" id="histogram3"></svg>
            </div>
            <div class="col-7">
                <div className="pe-2 text-start">
                    <strong id="z_llm" className="fs-4">z_llm_value</strong>
                    <strong id="z_score" className="fs-6"></strong>
                    <br></br>
                    <strong id="z_text" className="fs-6">z_text_value</strong>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}