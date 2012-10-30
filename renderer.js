function Renderer(game, canvas, context) {
  this.game = game;
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.camera = new Camera(this.width, this.height);
  this.context = context;

  this.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  this.draw = function() {
    for (var i = 0; i < this.game.branches.length; i++) {
      this.game.branches[i].draw(this.context);
    }
    this.game.player.draw(this.context);
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