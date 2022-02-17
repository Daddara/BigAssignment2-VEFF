/**
    Define the shapes
*/

function Shape(position, color) {
    this.position = position;
    this.color = color;
    this.lineWidth = drawio.lineWidth;
};

Shape.prototype.render = function () {};

Shape.prototype.move = function (position) {
    this.position = position;
};

Shape.prototype.resize = function () {};

function Rectangle(position, width, height, color) {
    Shape.call(this, position, color);
    this.width = width;
    this.height = height;
    this.color = color;
};

// Assign the prototype
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function () {
    // Render a rectangle
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    console.log(this.color);
    
};

Rectangle.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};


function Pen(position, color) {
    Shape.call(this, position);
    this.points = [];
    this.color = color;
}

// Assign the prototype
Pen.prototype = Object.create(Shape.prototype);
Pen.prototype.constructor = Pen;

Pen.prototype.render = function () {
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.lineWidth;
    drawio.ctx.lineCap = 'round';
    drawio.ctx.beginPath();
    for (var i = 0; i < this.points.length; i++) {
        point = this.points[i];
        drawio.ctx.lineTo(point.x, point.y);
    }
    drawio.ctx.stroke();
};

Pen.prototype.resize = function (x, y) {
    this.points.push({ x: x, y: y});
};


function Line(position, width, height, color) {
    Shape.call(this, position, width, height, color);
    this.color = color;
    this.width = width;
    this.height = height;
};

// Assign the prototype
Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function () {
    // Render a line
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.lineWidth;
    drawio.ctx.beginPath();
    drawio.ctx.moveTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(this.width + this.position.x, this.height + this.position.y);
    drawio.ctx.stroke();
    drawio.ctx.closePath();
    
};

Line.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};