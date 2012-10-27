var FPS = 30;

function Game(canvas, context) {
  this.renderer = new Renderer(canvas, context);

  this.onFrame = function() {
    this.update();
    this.draw();
  };

  this.update = function() {
  };

  this.draw = function() {
    this.renderer.clear();
  };

  this.start = function() {
    var self = this;
    this.frameTimer = setInterval(function() {
        self.onFrame();
      }, 1000 / FPS);
  };

  this.stop = function() {
    clearInterval(this.frameTimer);
  };
}