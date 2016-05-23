
var canvas = document.getElementById('myCanvas');
// Create an empty project and a view for the canvas:
paper.setup(canvas);

 var raster = new paper.Raster('marilyn');
        var size = new paper.Size(50, 50);
        var colSize = raster.size / size * 1.5;
        var fullSize = size * colSize;

        raster.visible = false;
        raster.size = size;
        for (var x = 0; x < size.width; x++) {
            for (var y = 0; y < size.height; y++) {
                var color = raster.getPixel(x, y);
                var gray = (1 - color.gray) * 0.9;
                if (gray > 0.1) {
                    var pos = new paper.Point(x, y) * colSize + colSize / 2;
                    var rectSize = gray * colSize.width;
                    var path = new paper.Path.Rectangle({
                        size: [rectSize, rectSize],
                        position: pos,
                        fillColor: 'black'
                    });
                    path.rotate(gray * 180);
                }
            }
        }
        paper.project._activeLayer._position = paper.view._center;
 	paper.view.draw();
        // Reposition the paths whenever the window is resized:
        function onResize(event) {
		paper.project._activeLayer._position = paper.view._center;
            paper.view.draw();
        }





















