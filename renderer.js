function Renderer(canvas, context) {
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.context = context;

  this.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  this.draw = function(pos) {
    this.context.fillStyle = '#729';
    this.context.fillRect(0, pos, 100, 100);
  };
}