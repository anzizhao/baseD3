$( function() {
var csv_text = 'date,sugar\n\
2011-01-13T15:42:08,108\n\
2011-01-14T15:42:08,108\n\
2011-01-15T15:42:08,108\n\
2011-01-16T15:42:08,108\n\
2011-01-17T15:42:08,108\n\
2011-02-15T20:58:25,121\n\
2011-02-16T20:58:25,121\n\
2011-02-17T20:58:25,121\n\
2011-02-18T20:58:25,121\n\
2011-02-19T20:58:25,121\n\
2011-02-20T20:58:25,121\n\
2011-02-21T20:58:25,121\n\
2011-03-08T16:55:07,100\n\
2011-03-08T18:29:12,91\n\
2011-03-08T19:30:37,94\n\
2011-03-08T21:34:27,126\n\
2011-03-09T08:38:01,242\n';
    var json = [ ];
    var width = $('#lab').width( ) - 10;

    json = d3.csv.parse(csv_text);
    json.forEach(fix_row);

    var url = './sugars.csv';

    var start = 'March 8 2011';
    //显示为一个月的开始和结束

    var first = d3.time.day.round(d3.time.day.offset(new Date(start), -1)),
        last  =  d3.time.day.round(d3.time.day.offset(new Date(start), 1));
    console.log('first', first, 'last', last);

    var days = d3.time.day.range(first, last);
    var pp_day = 90;
    opts = { range: d3.time.day.range(first, last),
                 width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, pp_day * days.length] )
        ;
    var draw = draw_graph('day_pp_day', json, opts);

    var radios = document.querySelectorAll('input[type=radio][name="dateInput"]');

    function changeHandler(event) {
        if ( this.value === 'a' ) {
            draw.render()
        } else if ( this.value === 'b' ) {
            draw.render()
        }   else if ( this.value === 'c' ) {
            draw.render()
        }   
    }

    Array.prototype.forEach.call(radios, function(radio) {
        radio.addEventListener('change', changeHandler);
    });

} );

// make these things debuggable from console
var my = { };

function draw_graph(name, data, our) {
  var results,
      chart,
      dots,
      margin = our.margin || 100,
      w = 8,
      h = 200,
      x, y,
      width = our.width || $('#lab').width( ),
      xAxis, yAxis,
      zoom = 40,
      selector = '#' + name;
      ;
  var scaleExtent = [ 0, 200 ];

  // allow some granularity between our notion of scale and d3's
  var zScale = d3.scale.linear( ).domain(scaleExtent).rangeRound( [0, 1000] );
  // but force only 8 layout switches
  var zSwitching = d3.scale.linear( ).domain([0,1000]).rangeRound([0,8]);

  console.log($('#lab'), $('#lab').width( ), name);
  $('#lab #test').remove( );
  $('#lab').append( $('#clone').clone(true).attr('id', name) );
  $(selector).find('.title').text(name);
  selector = selector + ' .view';

  chart = d3.select(selector).append( 'svg' )
      .attr( 'class', 'chart' )
      .attr( 'width', width )
      .attr( 'height', h )
      .append('g');

  d3.select(selector + ' svg g')
      .attr('transform', 'translate(50, 50)');

  var first = our.range ? our.range[0] : d3.time.day.round(d3.time.day.offset(new Date( ), -1)),
      last  = our.range ? our.range[our.range.length - 1] : d3.time.day.round(d3.time.day.offset(new Date( ), 1))
      ;


  // x = our.xScale.copy( ) || d3.time.scale()
  x = our.xScale.copy( );
  this.xScale = x

  // viewport is wider than our scaling defined... rescale
  if (x.range()[1] < width) {
    last = x.invert(width);
    
    x = x.copy( ).domain( [first, last] )
     .range( [0, width ] );
  }

  y = d3.scale.linear()
      .domain( [0, d3.max( data, function( d ) { return d.sugar; } )] )
      .rangeRound( [0, h - margin] );

  // safety bars
  var safeties = {
    low: 70,
    high: 140,
    x: x.range()[0],
    y: (h - margin) - y(140) + .5,
    width: (width),
    height: y(140) -  y(70)  + .5

  };
  var bars = chart.append('g')
          .attr('class', 'safety');

  bars.append('rect')
      .attr('class', 'safe-sugar')
      ;


  // Bars
  dots = chart.append('g')
      .attr('class', 'dots');

  dots.selectAll( 'circle' )
      .data( data )
    .enter().append( 'circle' )
      .attr( 'r', '.25ex')
      // .attr( 'width', w )
      // .attr( 'height', function( d ) { return y( d.population ) } )
      ;

  // Axis
  xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(12, 1, 1)
      //.ticks(d3.time.month, 1)
      .ticks(d3.time.day, 1)
      //.tickFormat(d3.time.format('%m/%d/%y'))
      //.tickSize(25, 18);

  yAxis = d3.svg.axis()
      .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.sugar || 0; } )] ).rangeRound( [h - margin, 0] ))
      .tickSize(6, 3, 1)
      .orient('left');

  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (h - margin) + ')');

  chart.append('g')
      .attr('class', 'y axis');

  d3.select(selector + " svg").call(d3.behavior.zoom()
    //  By supplying only .x() any pan/zoom can only alter the x scale.  y
    //  scale remains fixed.
    .x(x)
    .scaleExtent( scaleExtent )
    .scale( 1 )
    .on("zoom",draw_graph.render)
  );

  draw_graph.render = function () {
      bars.selectAll("rect")
      .attr( 'x', safeties.x)
      .attr( 'y', safeties.y)
      .attr( 'width', safeties.width)
      .attr( 'height', safeties.height)
      ;

      dots.selectAll("circle")
      .attr( 'cx', function( d, i ) { return x( d.date ) - .5; } )
      .attr( 'cy', function( d ) { return (h - margin) - y( d.sugar ) + .5 } )
      ;

      xAxis.scale(x);

      chart.select(".x.axis").call(xAxis);
      chart.select(".y.axis").call(yAxis);
  }

  // Call this to place initially
  draw_graph.render();
  return draw_graph
}



function update_data(rows)  {
  // console.log('XXX', this, arguments);
  if (rows) {
    rows.forEach(fix_row);
    draw_graph('test', rows);
  }
}

function fix_row(row, i) {
  row.date = d3.time.format.iso.parse(row.date);
  row.sugar = parseInt(row.sugar);
}

