

paper.install(window);
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    var raster = new Raster('test');
    var size = new paper.Size(50, 50);
    var colSize = raster.size.divide( size.multiply(1.5) );
    var fullSize = size.multiply(colSize);


    raster.visible = false;
    raster.size = size;

    for (var x = 0; x < size.width; x++) {
        for (var y = 0; y < size.height; y++) {
            var color = raster.getPixel(x, y);
            var gray = (1 - color.gray) * 0.9;
            if (gray > 0.1) {
                var pos = new Point(x, y).multiply( colSize ).add( colSize.divide(2) );
                var rectSize = gray * colSize.width;
                var path = new Path.Rectangle({
                    size: [rectSize, rectSize],
                    position: pos,
                    fillColor: 'black'
                });
                path.rotate(gray * 180);
            }
        }
    }
    // can work code 
    //var path = new Path.Rectangle([75, 75], [100, 100]);
    //path.strokeColor = 'black';
    //view.onFrame = function(event) {
        //path.rotate(3);
    //}


    project.activeLayer.position = view.center;

    //var myPath = new paper.Path();
    //myPath.strokeColor = 'red';
    //myPath.strokeWidth = 2.5;

    //paper.view.draw();

    // Reposition the paths whenever the window is resized:
    view.onFrame = function (event) {
        //paper.project._activeLayer._position = paper.view._center;
        //paper.project.activeLayer.position = paper.view.center;
        project.activeLayer.position = view.center;
        //paper.view.draw();
    }
}






















