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

var op = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 0.7])

const canvas = d3.select('.canvas');
const canvas1 = d3.select('.canvas1');
const bin_container = d3.select('.bin_container')

var max_radius = 10;
var map_ = ['#f48382', '#f8bd61', '#ece137', '#c3c580', '#82a69a', '#80b2c5', '#8088c5', '#a380c5', '#c77bab', '#AB907F'];

$(document).ready(function() {

    d3.csv('/data/1.csv', function(d, i) {

        d.x = +d.xposp
        d.y = +d.yposp
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

        var hex_data = hexbin(inputForHexbinFun)
            .map( d => ((d.pred = find_frequent(d)), d))

        // Plot the hexbins
        bin_container.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", 500)
            .attr("height", 500)

        bin_container.append("g")
            .attr("clip-path", "url(#clip)")
            .selectAll("path")
            .data( hex_data )
            .enter().append("path")
              .attr("r", function(d) {
                return d.pred;
              })
              .attr("d", function(d) {
                return hexbin.hexagon(radius(d.length));
              })
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
              //.attr("fill", function(d) { return color(d.length); })
              .attr("fill", function(d) { return map_[d.pred];})
              .attr("stroke", "black")
              .attr("stroke-width", "0.1")
              .attr("opacity", function(d) { return op(d.length); })

    })

    function radius(val) {
        if (val > max_radius) {
            return max_radius;
        }
        return val;
    }

    function find_frequent(d) {
        
        var count = {}

        d.forEach(function(d) {

            if (!count[d.pred]) {
                count[d.pred] = 1;
            }
            else {
                count[d.pred]++;
            }

        })

        const result = Object.entries(count).reduce((a, b) => a[1] > b[1] ? a : b)[0]

        return result;
    }


})
