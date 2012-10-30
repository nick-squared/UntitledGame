var FPS = 30;

function Game(canvas, context) {
  this.renderer = new Renderer(this, canvas, context);
  this.branches = [];

  var testBranchList = [];
  for (var i = 0; i < 50; i++) {
    testBranchList[i] = [50 + i * 15, 200 - 5 * Math.sin(i) - 2 * i];
  }
  this.testBranch = new Branch(testBranchList);
  this.branches.push(this.testBranch);
  this.player = new Player();
  this.player.onGround = true;
  this.player.currentSegment = this.testBranch.segments[0];
  this.player.pos[0] = this.player.currentSegment.center[0] + this.player.width / 2 * Math.cos(this.player.currentSegment.normal);
  this.player.pos[1] = this.player.currentSegment.center[1] - this.player.height / 2 * Math.sin(this.player.currentSegment.normal);

  this.onFrame = function() {
    this.update();
    this.draw();
  };

  this.update = function() {
    this.player.update();
  };

  this.draw = function() {
    this.renderer.clear();
    this.renderer.draw();
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