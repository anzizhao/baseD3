$( function() {
    //不然产生空白, 解释时间出错
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
    var data = json 

    var start = 'March 8 2011';
    var switchMode = 'y'
    var timeline = {
        margin: 100,
        height: 200 ,
        width: $('#lab').width( ),
    }
    var scaleExtent = [ 0, 10 ]; // 可以根据年月日  扩大倍数不一样

    //显示为一个月的开始和结束
    var init = {}
    init.dayOffset = 1
    init.firstDay =  d3.time.day.round( d3.time.day.offset(new Date(start), -init.dayOffset ) )
    init.lastDay =  d3.time.day.round( d3.time.day.offset(new Date(start), init.dayOffset ) )
    init.xScale = d3.time.scale()
    init.yScale =  d3.scale.linear()
    .domain( [0, d3.max( data , function( d ) { return d.sugar; } )] )
    .rangeRound( [0, timeline.height - timeline.margin] );

    var yScale = init.yScale 
    var xScale 
    var focusDate = init.firstDay

    var selector = '#timeline .view' ;
    var chart = d3.select(selector).append( 'svg' )
    .attr( 'class', 'chart' )
    .attr( 'width', timeline.width )
    .attr( 'height', timeline.height )
    .append('g');

    d3.select(selector + ' svg g')
    .attr('transform', 'translate(50, 50)');

    // safety bars ? 这个有什么作用呢
    var safeties = {
        low: 70,
        high: 140,
        x: 0,
        y: (timeline.height - timeline.margin) - yScale(140) + .5,
        width: timeline.width,
        height: yScale(70) + .5

    };
    // bars 
    var bars = chart.append('g')
    .attr('class', 'safety');

    bars.append('rect')
    .attr('class', 'safe-sugar')
    ;
    // dots 
    var dots = chart.append('g')
    .attr('class', 'dots');

    dots.selectAll( 'circle' )
    .data( data )
    .enter().append( 'circle' )
    .attr( 'r', '.25ex')


    // Axis
    var xAxis = d3.svg.axis()
    .tickSize(12, 1, 1)

    var yAxis = d3.svg.axis()
    .scale( init.yScale )
    .tickSize(6, 3, 1)
    .orient('left');

    chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + (timeline.height - timeline.margin) + ')');

    chart.append('g')
    .attr('class', 'y axis');



    //listen switch change 
    $('#clearSign').on('click', clearSign )

    var radios = document.querySelectorAll('input[type=radio][name="dateInput"]');

    Array.prototype.forEach.call(radios, function(radio) {
        radio.addEventListener('change', changeHandler);
    });

    dateSwitch()

    function dateSwitch ( mode ){
        var unit = 240 
        var tmp , first, last  
        switchMode = mode 
        switch(mode) {
            case 'y': 
                tmp = d3.time.year.round(d3.time.year.offset(focusDate, 1) )
                xScale  = init.xScale.copy().domain([ focusDate, tmp  ])
                .range(  [0,  unit * 2] )

                first  = d3.time.year.round( focusDate ) 
                last = xScale.invert(timeline.width)
                xScale   = xScale.copy().domain( [first, last] )
                .range( [0, timeline.width ] );
                xAxis.ticks(d3.time.year, 1)
                .tickFormat(
                    d3.time.format("%Y年")
                )
                break
            case 'm': 
                tmp = d3.time.month.round(d3.time.month.offset(focusDate, 1) )
                xScale  = init.xScale.copy().domain([ focusDate, tmp  ])
                .range(  [0, unit / 2] )
                //转化
                //  确定开始和结束的点
                first  = d3.time.month.round( focusDate ) 
                last = xScale.invert(timeline.width)
                xScale   = xScale.copy().domain( [first, last] )
                .range( [0, timeline.width ] );

                xAxis.ticks(d3.time.month, 1)
                .tickFormat(
                    d3.time.format("%m月")
                )
                break;
            case 'd': 
            default: 
                tmp = d3.time.day.round(d3.time.day.offset(focusDate, 1) )
                xScale  = init.xScale.copy().domain([ focusDate, tmp  ])
                .range(  [0, unit / 5] )

                first  = d3.time.day.round( focusDate ) 
                last = xScale.invert(timeline.width)
                xScale   = xScale.copy().domain( [first, last] )
                .range( [0, timeline.width ] );

                xAxis.ticks(d3.time.day , 1)
                .tickFormat(
                    d3.time.format("%d日")
                )
        }
        d3.select(selector + " svg").call(
            d3.behavior.zoom()
            .x( xScale )
            .scaleExtent( scaleExtent )
            .scale( 1 )
            .on("zoom", render )
        );
    
        render()
    }


    function render  () {
        bars.selectAll("rect")
        .attr( 'x', safeties.x)
        .attr( 'y', safeties.y)
        .attr( 'width', safeties.width)
        .attr( 'height', safeties.height)
        .on("click", changeFocusDate )
        .on("dblclick", enterChildDate )

        dots.selectAll("circle")
        .attr( 'cx', function( d, i ) { 
            //console.log( d.date )   
            return xScale( d.date ) - .5; 
        })
        .attr( 'cy', function( d ) { return (timeline.height - timeline.margin) - yScale( d.sugar ) + .5 } )
        ;

        xAxis.scale( xScale )

        chart.select(".x.axis").call(xAxis)
        .on('click', signAxis )

        //.selectAll("text") 
        //.attr("transform", function(d) {
            //return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
        //});


        //chart.select(".y.axis").call(yAxis);
    }

    function changeHandler(event) {
        event.preventDefault()
        dateSwitch ( this.value )
    }

    function enterChildDate (){
        event.preventDefault()
        console.log('enter Child Date')
        changeFocusDate.call(this)

        switch( switchMode ) {
            case 'y': 
                dateSwitch('m')             
                break
            case 'm': 
                dateSwitch('d')             
                break 

            default:
                return 
        
        }
    }

    function signAxis (){
        event.preventDefault()
        //TODO 建立红点
        var offsetX = event.offsetX 
        var referOffset = $('.x.axis').offset().left
        var width = offsetX - referOffset 
        chart.select(".x.axis")
            .append('circle')
            .attr({
                'cx': width ,
                'cy': 0,
                'r': 8,
                'fill': '#CB1414',
                'opacity': 0.5
            })
    }

    function changeFocusDate(){
        // 没有event传入来  不过环境中拥有
        // get mouse width  
        event.preventDefault()
        var offsetX = event.offsetX 
        var referOffset = $('.x.axis').offset().left
        var width = offsetX - referOffset
        if( width < 0 ) {
            return 
        }
        // change to date 
        focusDate = xScale.invert( width )
        console.log('focus on date: ', focusDate )
    }

    function fix_row(row, i) {
        row.date = d3.time.format.iso.parse(row.date);
        row.sugar = parseInt(row.sugar);
    }

    function clearSign(){
        chart.selectAll(".x.axis circle")
        .remove()
    }

});


