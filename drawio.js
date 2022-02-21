window.drawio = {
    shapes: [],
    shapesUndone: [],
    shapeFiller: false,
    selectedShape: 'pen',
    drawColor: "#000000",
    lineWidth: 8,
    txt: '',
    fontSize: 15,
    font: "Arial",
    drag: false,
    dragok: false,
    selectedMove: null,
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    selectedElement: null,
    textElement: null,
    availableShapes: {
        RECTANGLE: 'rectangle',
        PEN: 'pen',
        CIRCLE: 'circle',
        LINE: 'line',
        TEXT: 'text' 
    }
};

drawio.canvas.width = 1000;
drawio.canvas.height = 700;

// Creating a small array of possible fonts
var selectOption = document.getElementById('select');
var fontArr =  [
    "Arial",
    "Verdana",
    "Helvetica",
    "Tahoma",
    "Trebuchet",
    "Times",
    "Georgia",
    "Garamond",
    "Courier New",
    "Brush Script"
];
for(var i = 0;i<fontArr.length;i++){ 
    var opt = document.createElement("option");
    if(fontArr[i] === "Times"){
        opt.value = "Times New Roman";
    }
    else{
        opt.value = fontArr[i];
    }
    opt.text = fontArr[i];
    opt.className = fontArr[i];
    selectOption.appendChild(opt);
} 

$(function () {
    // Document is loaded and parsed
    var $input = $("#canvasInput");
    var tool = {};
    //Setting initial values of selected visual indicator and logic
    $('#pen').addClass('selected');
    $('#stroke').addClass('fillselected');
    function drawCanvas() {
        console.log(drawio.selectedElement);
        if (drawio.selectedElement) {
            drawio.selectedElement.render();
        }
        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
        console.log(drawio.shapes.length);
    };

    // Visual indicator and logical selector of shape type
    $('.select').on('click', function () {
        $('.select').removeClass('selected');
        console.log(this);
        $(this).addClass('selected');
        if(this.id != "move"){
            $('#canvas').css("cursor", "default");
            drawio.drag = false;
        }
        drawio.selectedShape = $(this).data('shape');
        $input.css("display", "none");
    });

    //Change cursor to canvas when move selected
    $('#move').on('click', function(){
        drawio.drag = true;
        $('#canvas').css("cursor", "grab");
        $(this).addClass('selected');
    })

    //stroke and fill visual indicator
    $('.otherfill').on('click', function(){
        $('.otherfill').removeClass('fillselected');
        $(this).addClass('fillselected');
    });


    // mousedown
    $('#canvas').on('mousedown', function (mouseEvent) {
        var pos = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        if(drawio.drag){
            $('#canvas').css("cursor", "grabbing");
            // Get
            drawio.dragok = true;
            drawio.selectedMove = getPressedPiece(mouseEvent);
            if(drawio.selectedMove != null){
                var index = drawio.shapes.indexOf(drawio.selectedMove);
                if(index > -1){
                    drawio.shapes.splice(index, 1);
                    drawio.shapes.push(drawio.selectedMove);
                }
                drawio.selectedMove.offset = {
                    x: pos.x - drawio.selectedMove.position.x,
                    y: pos.y - drawio.selectedMove.position.y
                }
            }
            // Drag elem
        }
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
                drawio.selectedElement = new Rectangle(pos, 0, 0, drawio.drawColor);
                break;
            case drawio.availableShapes.PEN:
                drawio.selectedElement = new Pen(pos, drawio.drawColor);
                break;
            case drawio.availableShapes.CIRCLE:
                drawio.selectedElement = new Circle(pos, 0, 0, 0, drawio.drawColor);
                break;
            case drawio.availableShapes.LINE:
                drawio.selectedElement = new Line(pos,0, 0, drawio.drawColor);
                break;
            case drawio.availableShapes.TEXT:
                tool.startx = pos.x + $('#canvas').offset().left;
                tool.starty = pos.y + $('#canvas').offset().top;
                $input.css({
                  display: "block",
                  position: "absolute",
                  left: tool.startx,
                  top: tool.starty
                });
                drawio.selectedElement = new Text(pos, 0, 0, drawio.drawColor);
                $input.focus();
                
                break
            
        }
    });

    // mousemove
    $('#canvas').on('mousemove', function (mouseEvent) {
        if(drawio.dragok){
            //Start dragging
            if(drawio.selectedMove != null){
                drawio.selectedMove.position.x = mouseEvent.offsetX - drawio.selectedMove.offset.x;
                drawio.selectedMove.position.y = mouseEvent.offsetY - drawio.selectedMove.offset.y;
                drawio.selectedMove.move(drawio.selectedMove.position.x, drawio.selectedMove.position.y);
                drawio.ctx.clearRect(0,0,canvas.width,canvas.height);
                drawCanvas();
            }
        }
        if (drawio.selectedElement) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
        }
    });

    // mouseup
    $('#canvas').on('mouseup', function () {
        drawio.dragok = false;
        if(drawio.drag){
            $('#canvas').css("cursor", "grab");
            drawio.selectedMove = null;
        }
        if (drawio.selectedElement && drawio.selectedElement != 'Text') {
            $input.css("display", "none").val("");
            drawio.shapes.push(drawio.selectedElement);
            drawCanvas();
            drawio.txt = '';
            drawio.selectedElement = null;
        }
    });

    // lineWidth Change
    $('#lineRange').on('change', function () {
        console.log("Changing ", $("#lineRange").val());
        drawio.lineWidth = $("#lineRange").val();
    });

    // change font size
    $('#fontsize').on('change', function () {
        console.log("Fontsize change ", $("#fontsize").val());
        drawio.fontSize = $("#fontsize").val();
    });

    // Change font
    $('#select').on('change', function() {
        drawio.font = this.value;
      });

    // text input
    $('#canvasInput').on('input', function () {
        drawio.Text = $('#canvasInput').val();
    });

    // Save select
    $('#savedSelect').on('change', function() {
        var data = JSON.parse(myStorage.getItem(this.value));
        // Iterate over data and assign the correct object type according to key
        for(var i = 0; i < data.length; i++){
            switch (Object.keys(data[i])[0]){
                case "Rectangle":
                    var tmp = new Rectangle(data[i].Rectangle.position, data[i].Rectangle.width, data[i].Rectangle.height, data[i].Rectangle.color);
                    tmp.lineWidth = data[i].Rectangle.lineWidth;
                    tmp.fill = data[i].Rectangle.fill;
                    data[i] = tmp;
                    break;
                case "Pen":
                    var tmp = new Pen(data[i].Pen.position, data[i].Pen.color);
                    tmp.points = data[i].Pen.points;
                    tmp.lineWidth = data[i].Pen.lineWidth;
                    data[i] = tmp;
                    break;
                case "Circle":
                    var tmp = new Circle(data[i].Circle.position, data[i].Circle.width, data[i].Circle.height, data[i].Circle.radius, data[i].Circle.color);
                    tmp.lineWidth = data[i].Circle.lineWidth;
                    tmp.fill = data[i].Circle.fill;
                    data[i] = tmp;
                    break;
                case "Line":
                    var tmp = new Line(data[i].Line.position, data[i].Line.height, data[i].Line.width, data[i].Line.color);
                    tmp.lineWidth = data[i].Line.lineWidth;
                    data[i] = tmp;
                    break
                case "Text":
                    var tmp = new Text(data[i].Text.position, 0, 0);
                    tmp.lineWidth = data[i].Text.lineWidth;
                    tmp.font = data[i].Text.font;
                    tmp.fontSize = data[i].Text.fontSize;
                    tmp.text = data[i].Text.text;
                    data[i] = tmp;
                    break
            }
        }
        drawio.shapes = [];
        drawio.shapesUndone =[];
        drawio.ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawio.shapes = data;
        drawCanvas();
      });

    $input.keyup(function(e) {
        //Pressing enter to put the text to the canvas
        if (e.keyCode === 13) {
            e.preventDefault();
            drawio.txt = $input.val();
            if($input.val() !== ""){
                drawio.selectedElement.text = drawio.txt;
                drawio.selectedElement.render();
                drawio.shapes.push(drawio.selectedElement); 
                
            }
            drawCanvas();
            drawio.txt = '';
            drawio.selectedElement = null;
            //set the display to none for the input and erase its value
            $input.css("display", "none").val("");
            
        }
        //Pressing Escape to cancel
        if (e.keyCode === 27) {
          e.preventDefault();
          drawio.txt = "";
          $input.css("display", "none").val("");
        }
      });


    //clear canvas
    $('#new').on('click', function () {
        if (drawio.shapes.length) {
        drawio.shapes = [],
        drawio.shapesUndone =[],
        drawio.ctx.clearRect(0,0,canvas.width,canvas.height);
        drawCanvas(); 
        console.log("New Image");
        }
    });

    //undo
    $('#undo').on('click', function () {
        if (drawio.shapes.length > 0){
            var undoItem = drawio.shapes.pop();
            drawio.shapesUndone.push(undoItem);
            drawio.selectedElement = null;
            drawio.ctx.clearRect(0,0,canvas.width,canvas.height);
            drawCanvas(); 
            console.log("Undo");
        }
    });

    //redo
    $('#redo').on('click', function () {
        if (drawio.shapesUndone.length){
        var redoitem = drawio.shapesUndone.pop();
        drawio.shapes.push(redoitem);
        drawCanvas(); 
        console.log("Redo");
        }
    });

    //fill
    $('#fill').on('click', function () {
        drawio.shapeFiller = true;
        console.log("Fill");
    });

    //stroke
    $('#stroke').on('click', function () {
        drawio.shapeFiller = false;
        console.log("Stroke");
    });

    // fillselect
    $('.fillselect').on('click', function () {
        $('.fillselect').removeClass('fillselected');
        console.log(this);
        $(this).addClass('fillselected');
    });


    // Save and load
    myStorage = window.localStorage;
    $('#save').on('click', function () {
        var fileNames = [];
        for (var j = 0; j < myStorage.length; j++) {
            fileNames.push(myStorage.key(j));
        }
        var fileName = window.prompt("Please give your drawing a name: ");
        var newShapeArr = [];
        // Iterate over array and assign key value, where key is the correct instance of the Object
        for(var k = 0; k < drawio.shapes.length; k++){
            var strobj = {};
            if(drawio.shapes[k] instanceof Pen){
                console.log("This is Pen with nr: ", k);
                strobj = {'Pen': drawio.shapes[k]};  
            }
            else if(drawio.shapes[k] instanceof Rectangle){
                strobj = {'Rectangle': drawio.shapes[k]};
            }
            else if(drawio.shapes[k] instanceof Circle){
                strobj = {'Circle': drawio.shapes[k]};
            }
            else if(drawio.shapes[k] instanceof Text){
                strobj = {'Text': drawio.shapes[k]};
            }
            else if(drawio.shapes[k] instanceof Line){
                strobj = {'Line': drawio.shapes[k]};
            }
            newShapeArr.push(strobj);
            
        }
        console.log(JSON.stringify(newShapeArr));
        myStorage.setItem(fileName,  JSON.stringify(newShapeArr));
    });
    
    var savedOption = document.getElementById('savedSelect');
    for(var j = 0; j < myStorage.length; j++){
        var myKey = myStorage.key(j);
        var opt = document.createElement("option");
        opt.value = myKey;
        opt.text = myKey;
        savedOption.appendChild(opt);
    }
    var hell = myStorage.getItem("canvas");
});


function getPressedPiece(loc){
    // Iterate over list of shapes in reverse order to find if user clicked an element
    for(var i = drawio.shapes.length -1; i >= 0 ; i--){
        if(loc.offsetX >= drawio.shapes[i].position.x - (drawio.shapes[i].width) && loc.offsetX <= drawio.shapes[i].position.x + (drawio.shapes[i].width) &&
            loc.offsetY >= drawio.shapes[i].position.y - (drawio.shapes[i].height) && loc.offsetY <= drawio.shapes[i].position.y + (drawio.shapes[i].height)){
                console.log("INSIDE!!!!!");
                return drawio.shapes[i];
            }
        return null;
    }
}


// Event listeners for color change
let colorInput = document.querySelector("#color");

colorInput.addEventListener('input', () =>{
    console.log(colorInput.value);
    drawio.drawColor = colorInput.value;
    
});

colorInput.addEventListener('onchange', () =>{
    console.log(colorInput.value);
    drawio.drawColor = colorInput.value;
})


