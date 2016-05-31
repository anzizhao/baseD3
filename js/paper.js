

paper.install(window);
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    var raster = new Raster('test');
    //将一张图片平均等分50
    var size = new paper.Size(50, 50); 

    // The size of our grid cells:
    var gridSize = 12;
    // Space the cells by 120%:
    var spacing = 1.2;

    raster.visible = false;
    raster.size = size;

    for (var x = 0; x < size.width; x++) {
        for (var y = 0; y < size.height; y++) {

            //var pos = new Point(x, y).multiply( colSize ).add( colSize.divide(2) );

            var color = raster.getPixel(x, y);

            // Create a circle shaped path:
            var path = new Path.Circle({
                center: new Point(x, y).multiply( gridSize ),
                radius: gridSize / 2 / spacing
            });

            // Set the fill color of the path to the color
            path.fillColor = color;
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






















