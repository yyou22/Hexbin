import './assets/scss/app.scss'

var $ = require('jquery')
var d3 = require('d3')
import * as d3HB from "d3-hexbin";

var x1 = d3.scaleLinear()
    .domain([0, 1.0])
    .range([50, 450])

var y1 = d3.scaleLinear()
    .domain([0, 1.0])
    .range([50, 450])

const canvas = d3.select('.canvas');
const canvas1 = d3.select('.canvas1');
const bin_container = d3.select('.bin_container')

var max_radius = 10;

$(document).ready(function() {

    d3.csv('/data/lvl4.csv', function(d, i) {

        d.x = +d.xpost
        d.y = +d.ypost
        d.pred = +d.pred

        return d;

    }).then(function(data) {

        var inputForHexbinFun = []
        data.forEach(function(d) {
            var p = [x1(d.x), y1(d.y)]
            p.pred = d.pred;
            inputForHexbinFun.push(p)
        })

        // Prepare a color palette
        var color = d3.scaleLinear()
            .domain([0, 30]) // Number of points in the bin?
            .range(["transparent",  "#69b3a2"])

        var hexbin = d3HB.hexbin()
            .radius(max_radius)
            .extent([[0, 0], [500, 500]])

        // Plot the hexbins
        bin_container.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", 500)
            .attr("height", 500)

        bin_container.append("g")
            .attr("clip-path", "url(#clip)")
            .selectAll("path")
            .data( hexbin(inputForHexbinFun) )
            .enter().append("path")
              .attr("d", function(d) {
                console.log(d);
                return hexbin.hexagon(radius(d.length));
              })
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
              .attr("fill", function(d) { return color(d.length); })
              .attr("stroke", "black")
              .attr("stroke-width", "0.1")

    })

    function radius(val) {
        if (val > max_radius) {
            return max_radius;
        }
        return val;
    }


})
