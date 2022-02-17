window.drawio = {
    shapes: [],
    shapesUndone: [],
    selectedShape: 'pen',
    drawColor: "#000000",
    lineWidth: 8,
    txt: '',
    fontSize: 10,
    font: "Arial",
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    selectedElement: null,
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
    $('#pen').addClass('selected');
    function drawCanvas() {
        if (drawio.selectedElement) {
            drawio.selectedElement.render();
        }
        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
    };

    $('.select').on('click', function () {
        $('.select').removeClass('selected');
        console.log(this);
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });

    // mousedown
    $('#canvas').on('mousedown', function (mouseEvent) {
        var pos = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        console.log("mousedown", pos);
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
                drawio.selectedElement = new Rectangle(pos, 0, 0, drawio.drawColor);
                break;
            case drawio.availableShapes.PEN:
                console.log("WE HAVE PEN");
                drawio.selectedElement = new Pen(pos, drawio.drawColor);
                break;
            case drawio.availableShapes.CIRCLE:
                console.log("WE HAVE CIRCLE");
                drawio.selectedElement = new Circle(pos, 0, 0, 0, drawio.drawColor);
                break;
            case drawio.availableShapes.LINE:
                console.log("WE HAVE LINE");
                drawio.selectedElement = new Line(pos,0, 0, drawio.drawColor);
                break
            case drawio.availableShapes.TEXT:
                console.log("TEXT");
                console.log($('#canvas').offset().left);
                console.log(pos.x);
                tool.startx = pos.x + $('#canvas').offset().left;
                tool.starty = pos.y + $('#canvas').offset().top;
                $input.css({
                  display: "block",
                  position: "absolute",
                  left: tool.startx,
                  top: tool.starty
                });
                $input.focus();
                drawio.selectedElement = new Text(pos, 0, 0);
                break
            
        }
    });

    // mousemove
    $('#canvas').on('mousemove', function (mouseEvent) {
        if (drawio.selectedElement) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
        }
    });

    // mouseup
    $('#canvas').on('mouseup', function () {
        console.log("upmouse", drawio.selectedElement);
        if (drawio.selectedElement && drawio.selectedElement != 'Text') {
            $input.css("display", "none").val("");
            drawio.shapes.push(drawio.selectedElement);
            drawio.selectedElement = null;
        }
    });

    // lineWidth Change
    $('#lineRange').on('change', function () {
        console.log("Changing ", $("#lineRange").val());
        drawio.lineWidth = $("#lineRange").val();
    });

    $('#fontsize').on('change', function () {
        console.log("Fontsize change ", $("#fontsize").val());
        drawio.fontSize = $("#fontsize").val();
    });

    $('#select').on('change', function() {
        console.log( this.value );
        drawio.font = this.value;
      });

    // text input
    $('#canvasInput').on('input', function () {
        drawio.Text = $('#canvasInput').val();
    });

    // Save select
    $('#savedSelect').on('change', function() {
        console.log( this.value );
        var data = JSON.parse(myStorage.getItem(this.value));
        console.log("SUCK ME ",data);
        for(var i = 0; i < data.length; i++){
            switch (Object.keys(data[i])[0]){
                case "Rectangle":
                    console.log("RECT");
                    console.log(data[i]);
                    var tmp = new Rectangle(data[i].Rectangle.position, data[i].Rectangle.width, data[i].Rectangle.height, data[i].Rectangle.color);
                    tmp.lineWidth = data[i].Rectangle.lineWidth;
                    data[i] = tmp;
                    // drawio.selectedElement = new Rectangle(pos, 0, 0, drawio.drawColor);
                    break;
                case "Pen":
                    console.log("WE HAVE PEN");
                    console.log(data[i]);
                    var tmp = new Pen(data[i].Pen.position, data[i].Pen.color);
                    tmp.points = data[i].Pen.points;
                    tmp.lineWidth = data[i].Pen.lineWidth;
                    data[i] = tmp; 
                    // drawio.selectedElement = new Pen(pos, drawio.drawColor);
                    break;
                case "Circle":
                    console.log("WE HAVE CIRCLE");
                    console.log(data[i]);
                    var tmp = new Circle(data[i].Circle.position, data[i].Circle.width, data[i].Circle.height, data[i].Circle.radius, data[i].Circle.color);
                    tmp.lineWidth = data[i].Circle.lineWidth;
                    data[i] = tmp;
                    // drawio.selectedElement = new Circle(pos, 0, 0, 0, drawio.drawColor);
                    break;
                case "Line":
                    console.log("WE HAVE LINE");
                    console.log(data[i]);
                    var tmp = new Line(data[i].Line.position, data[i].Line.height, data[i].Line.width, data[i].Line.color);
                    tmp.lineWidth = data[i].Line.lineWidth;
                    data[i] = tmp;
                    // drawio.selectedElement = new Line(pos,0, 0, drawio.drawColor);
                    break
                case "Text":
                    console.log("TExT");
                    console.log(data[i]);
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
        drawio.shapes = data;
        drawCanvas();
      });

    $input.keyup(function(e) {
        //Pressing enter to put the text to the canvas
        if (e.keyCode === 13) {
            e.preventDefault();
            // drawio.ctx.font = 12 + "px sans-serif";
            console.log("VAL", $input.val());
            drawio.txt = $input.val();
            if($input.val() !== ""){
                drawio.selectedElement.render();
                console.log(drawio.selectedElement);
                drawio.shapes.push(drawio.selectedElement); 
                
            }
            drawCanvas();
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
        drawio.shapes = [],
        drawio.shapesUndone =[],
        drawCanvas(); 
        console.log("New Image");
    });

    //undo
    $('#undo').on('click', function () {
        var undoItem = drawio.shapes.pop();
        drawio.shapesUndone.push(undoItem);
        drawCanvas(); 
        console.log("Undo");
        });

    //redo
    $('#redo').on('click', function () {
        var redoitem = drawio.shapesUndone.pop();
        drawio.shapes.push(redoitem);
        drawCanvas(); 
        console.log("Redo");
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
        for(var k = 0; k < drawio.shapes.length; k++){
            var strobj = {};
            console.log(drawio.shapes[k]);
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
    
    console.log(myStorage);
    var savedOption = document.getElementById('savedSelect');
    for(var j = 0; j < myStorage.length; j++){
        var myKey = myStorage.key(j);
        console.log(myKey);
        var opt = document.createElement("option");
        opt.value = myKey;
        opt.text = myKey;
        savedOption.appendChild(opt);
    }
    var hell = myStorage.getItem("canvas");
});

// const canvas = document.getElementById("canvas");
// canvas.width = 1000;
// canvas.height = 500;

// let context = canvas.getContext("2d");
// context.fillStyle = "white";

// let draw_color = "black";
// let draw_width = "2";
// let is_drawing = false;
let colorInput = document.querySelector("#color");

colorInput.addEventListener('input', () =>{
    console.log(colorInput.value);
    drawio.drawColor = colorInput.value;
    
});

// // canvas.addEventListener("touchstart", start, false);
// // canvas.addEventListener("touchmove", draw, false);
// canvas.addEventListener("mousedown", start, false);
// canvas.addEventListener("mousemove", draw,false);

// canvas.addEventListener("mouseup",stop, false)
// canvas.addEventListener("mouseout",stop, false)

// function start(event){
//     is_drawing = true;
//     context.beginPath();
//     context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
//     event.preventDefault();
// }

// function draw(event){
//     if(is_drawing){
//         context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop)
//         context.strokeStyle = draw_color;
//         context.lineWidth = draw_width;
//         context.lineCap = "round";
//         context.lineJoin = "round";
//         context.stroke();
//     }
//     event.preventDefault();
// }

// function stop(event){
//     if(is_drawing){
//         context.stroke();
//         context.closePath();
//         is_drawing = false;
//     }
//     event.preventDefault();
// }
