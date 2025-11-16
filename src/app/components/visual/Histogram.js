import * as d3 from 'd3'

export default class Histogram {
    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    }
    constructor(svg, width = 300, height = 300) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }
    initialize() {
        this.container = this.svg.append("g")
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");
        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();
        this.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip-histogram")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.width)
            .attr("height", this.height);
        this.svg
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
        this.container
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .attr("clip-path", "url(#clip-histogram)");;
    }

    update(data, xVar) {
        const categories = ["detection", "embedding", "fuzz"];
        const allScores = { detection: 0, embedding: 0, fuzz: 0 };
        allScores.detection += data.detection || 0;
        allScores.embedding += data.embedding || 0;
        allScores.fuzz += data.fuzz || 0;
        
        this.xScale.domain(categories).range([0, this.width]).padding(0.3);
        this.yScale.domain([0, 1]).range([this.height, 0]);
        this.container.selectAll("rect")
            .data(categories)
            .join(
                enter => enter
                    .append("rect")
                    .attr("x", d => this.xScale(d.x0))
                    .attr("width", d => this.xScale(d.x1) - this.xScale(d.x0) - 1)
                    .attr("y", this.height) 
                    .attr("height", 0) 
                    .attr("fill", "steelblue")
                    .transition() 
                    .duration(750)
                    .attr("y", d => this.yScale(allScores[d]))
                    .attr("height", d => this.height - this.yScale(allScores[d]))
            )
            .attr("x", d => this.xScale(d))
            // .attr("y", d => this.yScale(allScores[d]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => this.height - this.yScale(allScores[d]))
            .attr("fill", "lightgray")
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));
        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

        this.legend
            .append("text")
            .text("detection: " + allScores["detection"])
            .style("font-size", "15px")
            .attr("x", this.margin.left + 24)
            .attr("y", this.margin.top + 10)

        this.legend
            .append("text")
            .text("embedding: " + allScores["embedding"])
            .style("font-size", "15px")
            .attr("x", this.margin.left + 24)
            .attr("y", this.margin.top + 34)

        this.legend
            .append("text")
            .text("fuzz: " + allScores["fuzz"])
            .style("font-size", "15px")
            .attr("x", this.margin.left + 24)
            .attr("y", this.margin.top + 58)
    }
}
