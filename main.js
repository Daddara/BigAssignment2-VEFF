const canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 500;

let context = canvas.getContext("2d");
context.fillStyle = "white";

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;

// canvas.addEventListener("touchstart", start, false);
// canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw,false);

canvas.addEventListener("mouseup",stop, false)
canvas.addEventListener("mouseout",stop, false)

function start(event){
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function draw(event){
    if(is_drawing){
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop)
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event){
    if(is_drawing){
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    event.preventDefault();
}


function penSelector(){
    console.log("INSIDE PEN");
}

function rectSelector(){
    console.log("INSIDE rect");
}

function circleSelector(){
    console.log("circle INSIDE");
}

function lineSelector(){
    console.log("here draw line");
}

function textSelector(){
    console.log("Write txt");
}

function undoSelector(){
    console.log("UNDO here");
}

function redoSelector(){
    console.log("here we redo");
}