var FPS = 30;

function Game(canvas, context) {
  this.renderer = new Renderer(canvas, context);
  this.pos = 0;

  this.onFrame = function() {
    this.renderer.clear();
    this.pos += 5;
    this.renderer.draw(this.pos);
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