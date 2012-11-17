// Used for testing collisions. Very useful, so they're getting left in.
var hitRects = [];
var hitLines = [];

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
    this.context.save();
    this.camera.center(this.game.player.pos.x, this.game.player.pos.y);
    this.camera.translate(this.context);
    for (var i = 0; i < this.game.branches.length; i++) {
      this.game.branches[i].draw(this.context);
    }
    this.game.player.draw(this.context);

    // Hit detection testing, leaving in for future use.
    this.context.strokeStyle = '#C00';
    for(var i = 0;i < hitRects.length; i++) {
      this.context.strokeRect(hitRects[i].topLeft.x, hitRects[i].topLeft.y, hitRects[i].width, hitRects[i].height);
    }
    this.context.strokeStyle = '#00C';
    for(var i = 0;i < hitLines.length; i++) {
      this.context.beginPath();
      this.context.moveTo(hitLines[i][0].x, hitLines[i][0].y);
      this.context.lineTo(hitLines[i][1].x, hitLines[i][1].y);
      this.context.stroke();
    }
    this.context.restore();
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

  this.translate = function(context) {
    context.translate(-this.x, -this.y);
  };
}