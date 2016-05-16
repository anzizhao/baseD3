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
    var first = d3.time.day.round(d3.time.day.offset(new Date(start), -1)),
        last  =  d3.time.day.round(d3.time.day.offset(new Date(start), 1));
    console.log('first', first, 'last', last);
    var opts = { range: d3.time.hour.range(first, last),
                 width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, (20) ] )
        ;
    opts.tick_step =  9;
    opts.ticks = d3.time.hours;
    // draw_graph('test', json, opts);
    draw_graph('three_day_hours_20', json, opts);

    opts = { range: d3.time.hour.range(first, last),
                 width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, (266) ] )
        ;
    opts.tick_step = 9;
    opts.ticks = d3.time.hours;
    draw_graph('hour_266_9', json, opts);

    opts = { range: d3.time.hour.range(first, last),
                 width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, (100)] )
        ;
    opts.tick_step = 12;
    opts.ticks = d3.time.hours;
    draw_graph('hour_100_12', json, opts);

    opts = { range: d3.time.hour.range(first, last),
                 width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, (30)] )
        ;
    opts.tick_step = 9;
    opts.ticks = d3.time.hours;
    draw_graph('hour_30_9', json, opts);

    opts = { range: d3.time.minute.range(first, last, 15),
                 width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, (32)] )
        ;
    opts.tick_step = 15;
    opts.ticks = d3.time.minutes;
    draw_graph('quarter_hour', json, opts);

    opts = { range: d3.time.hour.range(first, last),
             width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, 80] )
        ;
    opts.tick_step = 9;
    opts.ticks = d3.time.hours;
    draw_graph('pinned_hours_256', json, opts);

    opts = { range: d3.time.day.range(first, last),
             width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, width/3] )
        ;
    opts.tick_step = 24;
    opts.ticks = d3.time.hours;
    draw_graph('threedays_3rd_width', json, opts);

    opts = { range: d3.time.hour.range(first, last),
             width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, width/3] )
        ;
    opts.tick_step = 24;
    opts.ticks = d3.time.hours;
    draw_graph('threedays_hours_3rd_width', json, opts);

    var days = d3.time.day.range(first, last);
    var pp_day = 45;
    opts = { range: d3.time.hour.range(first, last),
                 width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, pp_day * days.length] )
        ;
    opts.tick_step = 1;
    opts.ticks = d3.time.days;
    draw_graph('day_pp_day', json, opts);

    /*
    opts = { range: d3.time.hour.range(first, last),
             width: width, margin: 0 };
    opts.x0 = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, 256*3] )
        ;
    opts.xScale = d3.time.scale( )
        .domain( opts.x0.range( )
          .map( function (x) { return (x / .75); })
          .map(opts.x0.invert));
    opts.tick_step = 3;
    opts.ticks = d3.time.hours;
    draw_graph('small_scale_contrast', json, opts);
    opts = { range: d3.time.hour.range(first, last),
             width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, 256*2] )
        ;
    opts.tick_step = 9;
    opts.ticks = d3.time.hours;
    draw_graph('smaller_contrast', json, opts);
    */


    var quarter_hour = d3.time.minute.offset(first, 15);
    opts = { range: d3.time.minute.range(first, quarter_hour),
             width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, quarter_hour] )
        .range(  [0, .75] )
        ;
    // opts.tick_step = 3;
    // opts.ticks = d3.time.hours;
    draw_graph('one_quarter_hour', json, opts);

    var hour = d3.time.hour.offset(first, 1);
    opts = { range: d3.time.hour.range(first, hour),
             width: width, margin: 0 };
    opts.xScale = d3.time.scale()
        .domain( [first, hour] )
        .range(  [0, 10] )
        ;
    // opts.tick_step = 3;
    // opts.ticks = d3.time.hours;
    draw_graph('one_hour', json, opts);
    // d3.csv(url, update_data);

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
  /*
  first = our.range[0];
  last = our.range[our.range.length - 1];
  my.first = first;
  my.last = last;
  */
  // my.range = d3.time.day.range(d3.time.day.offset(last, -5), last);
  // my.range = d3.time.day.range(first, last);
  console.log(my);

  // x = our.xScale.copy( ) || d3.time.scale()
  x = our.xScale.copy( );
  // viewport is wider than our scaling defined... rescale
  if (x.range()[1] < width) {
    last = x.invert(width);
    /*
    console.log('old last is', x.range()[1],
                 '(', x.domain()[1], ')',
                'however try', x.invert(width), width);
    */
    
    x = x.copy( ).domain( [first, last] )
     .range( [0, width ] );
  }
  /*
  !!!our.xScale.copy ? our.xScale.copy( ) : d3.time.scale()
      .domain( [our.range[0], last] )
      .range(  [0, width - margin] )
      ;
      */

  y = d3.scale.linear()
      .domain( [0, d3.max( data, function( d ) { return d.sugar; } )] )
      .rangeRound( [0, h - margin] );

  // my.x = x;
  // my.y = y;
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
      // .ticks(our.ticks || 12, our.tick_step)
      // .ticks(our.tick_step)
      // .ticks( )
      .tickSize(12, 1, 1)
      ;
      // .tickFormat(d3.time.format('%m/%d/%y'))
      //.tickSize(25, 18);

  yAxis = d3.svg.axis()
      .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.sugar || 0; } )] ).rangeRound( [h - margin, 0] ))
      .ticks(7)
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
    .on("zoom",render)
  );
  // xAxis.scale(x);
  // chart.select(".x.axis").call(xAxis);
  /*
  */

  function render() {
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
  render();
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
  // console.log('rows each', this, arguments);

}

