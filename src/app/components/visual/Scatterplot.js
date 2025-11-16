import * as d3 from 'd3'
// import { getFeatureExplains} from "../explain";
import { get_explains } from './static';

import Histogram from "./Histogram";

export default class Scatterplot {
    margin = {
        top: 10,
        right: 100,
        bottom: 40,
        left: 40
    }

    constructor(svg, data, width = 1100, height = 500) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;
        this.handlers = {};
    }

    initialize() {
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)
        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);
        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.svg.append("text")
          .attr("class", "x_label")
          .attr("text-anchor", "middle")
          .attr("x",this.width / 2 + 10)
          .attr("y", this.height + this.margin.top + 35)
          .text("feature_id")
          .attr("fill", "black")
          .style("font-size", "16px")

        this.svg.append("text")
            .attr("text-anchor", "y_label")
            .attr("transform", "rotate(-90)")
            .attr("y", this.margin.left - 32)
            .attr("x", -this.margin.top - this.height/2 + 10)
            .text("cosine similarity")
            .attr("fill", "black")
            .style("font-size", "16px")
    }

    update(xVar, yVar, colorVar, useColor) {
        const RADIUS = 4;
        this.xVar = xVar;
        this.yVar = yVar;
        this.xScale.domain(d3.extent(this.data, d => d.feature_id)).range([0, this.width]);
        this.yScale.domain(d3.extent(this.data, d => d.cosine_average)).range([this.height, 0]);
        this.circles = this.container.selectAll("circle")
            .data(this.data)
            .join(
                (enter) => enter.append("circle"),
                (update) => update.attr("class", "updated"),
                (exit) => exit.transition().duration(500).attr("opacity", 0).remove()
            )
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("r", RADIUS + 5)
                    .attr("stroke-width", 5);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200) 
                    .attr("r", RADIUS) 
                    .attr("stroke-width", 2); 
            })
            .on("click", function() {
                d3.selectAll("circle")
                    .attr("stroke", "white")
                    .attr("strok-width", 2);

                let circle = d3.select(this)
                    .attr("stroke", "red")
                    .attr("stroke-width", 5);
                this.feature_id = circle.data()[0].feature_id;
                this.cosine_sim = circle.data()[0].cosine_average;
                const feature_x = d3.select("#feature_id");
                const cosine_y = d3.select("#cosine_similarity");
                feature_x.text("feature_id = " + this.feature_id);
                cosine_y.text(" average cosine_similarity = " + this.cosine_sim)
                let data = get_explains(this.feature_id).then(
                    result => {
                        if (result.length > 0) {
                            let data1 = result[0];
                            const svg2 = d3.select("#histogram1");
                            svg2.selectAll("*").remove();
                            let histogram1 = new Histogram(svg2);
                            histogram1.initialize();
                            histogram1.update(data1);
                            const x_text = d3.select("#x_text");
                            x_text.text(data1.Text)
                            const x_llm = d3.select("#x_llm");
                            x_llm.text("<" + data1.llm_explainer + ">")
                        } else {
                            const svg2 = d3.select("#histogram1");
                            svg2.selectAll("*").remove();
                            const x_llm = d3.select("#x_llm");
                            x_llm.text("");
                            const x_text = d3.select("#x_text");
                            x_text.text("")
                        }
                        window.scroll({
                            top: document.body.scrollHeight,
                            behavior: 'smooth'
                        });
                        if (result.length > 1) {
                            let data2 = result[1];
                            const svg3 = d3.select("#histogram2");
                            svg3.selectAll("*").remove();
                            let histogram2 = new Histogram(svg3);
                            histogram2.initialize();
                            histogram2.update(data2);
                            const y_text = d3.select("#y_text");
                            const y_llm = d3.select("#y_llm");
                            y_text.text(data2.Text)
                            y_llm.text("<" + data2.llm_explainer + ">")

                        } else {
                            const svg3 = d3.select("#histogram2");
                            svg3.selectAll("*").remove();
                            const y_text = d3.select("#y_text");
                            const y_llm = d3.select("#y_llm");
                            y_text.text("")
                            y_llm.text("")
                        }

                        if (result.length > 2) {
                            let data3 = result[2];
                            const svg4 = d3.select("#histogram3");
                            svg4.selectAll("*").remove();
                            let histogram3 = new Histogram(svg4);
                            histogram3.initialize();
                            histogram3.update(data3);
                            const z_text = d3.select("#z_text");
                            const z_llm = d3.select("#z_llm");
                            z_text.text(data3.Text)
                            z_llm.text("<" + data3.llm_explainer + ">")
                        } else {
                            const svg4 = d3.select("#histogram3");
                            svg4.selectAll("*").remove();
                            const z_text = d3.select("#z_text");
                            const z_llm = d3.select("#z_llm");
                            z_text.text("")
                            z_llm.text("")
                        }
     
                    }
                );
            })
        this.circles
            .transition()
            .attr("cx", d => this.xScale(d.feature_id))
            .attr("cy", d => this.yScale(d.cosine_average))
            .attr("fill", "navy")
            .attr("r", RADIUS)
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));
        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));
        
    }

}