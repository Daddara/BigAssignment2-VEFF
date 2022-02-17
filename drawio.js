window.drawio = {
    shapes: [],
    shapesUndone: [],
    selectedShape: 'pen',
    drawColor: "#000000",
    lineWidth: 8,
    txt: '',
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
drawio.canvas.height = 600;

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
                drawio.selectedElement = new Text(pos, 0, 0, "Arial", 12);
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
    $('#range').on('change', function () {
        console.log("Changing ", $("#range").val());
        drawio.lineWidth = $("#range").val();
    });

    // text input
    $('#canvasInput').on('input', function () {
        drawio.Text = $('#canvasInput').val();
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
    // console.log(drawio.ctx);
    // drawio.ctx.fillStyle = draw_color;
    
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
