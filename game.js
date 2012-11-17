var FPS = 30;

function Game(canvas, context) {
  this.renderer = new Renderer(this, canvas, context);
  this.branches = [];

  var testBranchList = [];
  for (var i = 0; i < 250; i++) {
    testBranchList[i] = new Vec2(400 + i * 20, 400 + Math.cos(i/25) * 200);
  }
  this.testBranch = new Branch(testBranchList);
  this.branches.push(this.testBranch);
  this.player = new Player();
  this.player.onGround = true;
  this.player.currentSegment = this.testBranch.segments[20];
  this.player.branchPos = 300;
  this.player.pos.x = this.player.currentSegment.center.x + this.player.width / 2 * Math.cos(this.player.currentSegment.normal);
  this.player.pos.y = this.player.currentSegment.center.y - this.player.height / 2 * Math.sin(this.player.currentSegment.normal);

  this.onFrame = function() {
    this.update();
    this.draw();
  };

  this.update = function() {
    this.player.update();

    if (!this.player.onGround) {
      // Do collisions with branches, and the individual segments.
      var playerMin = this.player.pos.copy().subtract(new Vec2(this.player.width / 2, this.player.height / 2));
      var playerNextPos = this.player.pos.copy().add(this.player.speed).add(new Vec2(this.player.width / 2, this.player.height / 2));
      var bounds = this.player.getBounds();

      for (var i = 0; i < this.branches.length; i++) {
        if (this.branches[i].bounds.lineIntersect(this.player.pos, playerNextPos)) {
          var segment = this.branches[i].collide(bounds);
          if (segment != undefined) {
            this.player.collide(segment);
          }
        }
      }
    }
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