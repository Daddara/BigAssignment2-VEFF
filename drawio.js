window.drawio = {
    shapes: [],
    shapesUndone: [],
    shapeFiller: false,
    selectedShape: 'pen',
    drawColor: "#000000",
    lineWidth: 8,
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    selectedElement: null,
    availableShapes: {
        RECTANGLE: 'rectangle',
        PEN: 'pen',
        CIRCLE: 'circle',
        LINE: 'line'
    }
};

drawio.canvas.width = 1000;
drawio.canvas.height = 600;

$(function () {
    // Document is loaded and parsed
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
        if (drawio.selectedElement) {
            drawio.shapes.push(drawio.selectedElement);
            drawCanvas();
            drawio.selectedElement = null;
        }
    });

    // lineWidth Change
    $('#range').on('change', function () {
        console.log("Changing ", $("#range").val());
        drawio.lineWidth = $("#range").val();
    });


    //clear canvas
    $('#new').on('click', function () {
        if (drawio.shapes.length) {
        drawio.shapes = [],
        drawio.shapesUndone =[],
        drawCanvas(); 
        console.log("New Image");
        }
    });

    //undo
    $('#undo').on('click', function () {
        if (drawio.shapes.length){
        var undoItem = drawio.shapes.pop();
        drawio.shapesUndone.push(undoItem);
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
