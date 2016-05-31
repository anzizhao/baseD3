







paper.install(window);
window.onload = function() {
    var picData = []

    //use raster get data 
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    var raster = new Raster('test');
    //将一张图片平均等分50
    var size = new paper.Size(20, 20); 

    // The size of our grid cells:
    var gridSize = 12;
    // Space the cells by 120%:
    var spacing = 1.2;

    var radius = gridSize / 2 / spacing

    raster.visible = false;
    raster.size = size;

    for (var x = 0; x < size.width; x++) {
        for (var y = 0; y < size.height; y++) {

            //var pos = new Point(x, y).multiply( colSize ).add( colSize.divide(2) );

            var color = raster.getPixel(x, y);
            var center =  new Point(x, y).multiply( gridSize )
            var item = {
                x: center.x ,
                y: center.y ,
                r:  radius,
                color: color,
            }
            picData.push( item )
        }
    }


/* SET UP ENV */
var map = {}, $circle, $div;
map.width = parseInt(d3.select("#render").style('width'));
map.height = parseInt(d3.select("#render").style('height'));


map.svg =
    d3.select('#render')
    .append('svg')
    .attr('width', map.width)
    .attr('height', map.height)
    .append('g');

map.svg.append('rect')
.attr('class', 'overlay')
.attr('width', map.width)
.attr('height', map.height);

/* PREPARE DATA and SCALES */

map.svg.nodes = picData 

//d3.range(100).map(function(d, i) {
    //return {
        //x: Math.random() * map.width / 2,
        //y: Math.random() * map.height / 2,
        //r: Math.random() * 10 + 3
    //};
//});



//map.nodes = map.svg.nodes.concat( map.canvas.nodes, map.divs.nodes );
map.nodes = map.svg.nodes;
var root = map.nodes[0];
root.r = 0;
root.fixed = true;

var x =
    d3.scale.linear()
    .domain([0, map.width])
    .range([0, map.width]);

var y =
    d3.scale.linear()
    .domain([0, map.height])
    .range([map.height, 0]);


/* PLOT */


map.svg.draw =
function() {
    $circle =
        map.svg.selectAll('circle')
        .data(map.svg.nodes).enter()
        .append('circle')
        .attr('r', radius)
        .attr('fill', function(d) { return d.color.toCSS(); })
        .attr('transform', map.svg.transform);
};


map.svg.draw();
map.svg.time = 0;
var loop = 0; // global var

map.redraw = function() {
    var exec = Date.now();
    $circle.attr('transform', map.svg.transform);
    map.svg.time += Date.now()-exec;
    exec = Date.now();

    loop++;
};


setInterval(function(d) { 
    d3.select('#framerate').selectAll('.tsvg').text("svg "+(map.svg.time/loop).toFixed(2)+"ms");
}, 500);

map.svg.transform =
    function(d) {
        return 'translate(' + x( d.x ) + ',' + y( d.y ) + ')';
    };


    /* FORCE */
    var force =
        d3.layout.force()
        .gravity(0.05)
        //.gravity(0)
        .charge( function(d, i) { return i ? 0 : -2000; } )
        .nodes(map.nodes)
        .size([map.width, map.height])
        .start();

    force.on('tick', function(e) {
        var q = d3.geom.quadtree(map.nodes), i;
        for (i = 1; i < map.nodes.length; ++i) {
            q.visit( collide(map.nodes[i]) );
        }
        map.redraw();
    });

    function collide(node) {
        var r = node.r + 16;
        var nx1 = node.x - r;
        var nx2 = node.x + r;
        var ny1 = node.y - r;
        var ny2 = node.y + r;
        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                            r = node.r + quad.point.r;
                            if (l < r) {
                                l = (l - r) / l * 0.5;
                                node.x -= x *= l;
                                node.y -= y *= l;
                                quad.point.x += x;
                                quad.point.y += y;
                            }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }


/* LISTENERS */
function mousemove() {
    var p = d3.mouse(this);
    root.px = x.invert( p[0] );
    root.py = y.invert( p[1] );
    force.resume();
}

d3.select('body')
.on('mousemove', mousemove)
.call( d3.behavior.zoom().x( x ).y( y ).scaleExtent([1, 8]).on('zoom', map.redraw) );


}




