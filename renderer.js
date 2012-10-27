function Renderer(canvas, context) {
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.camera = new Camera(this.width, this.height);
  this.context = context;

  this.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  this.draw = function() {
  };
}

function Camera(width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;

  this.center = function(x, y) {
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
  };
}