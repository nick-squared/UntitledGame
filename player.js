MOVEMENT_SPEED = 3;

function Player() {
  this.x = 0;
  this.y = 0;
  this.width = 20;
  this.height = 20;
  this.speed = [0, 0];
  this.onGround = false;
  this.currentSegment = undefined;

  this.draw = function(context) {
    context.save();
    if (this.onGround) {
      context.translate(this.x, this.y);
      context.rotate(this.currentSegment.normal);
    }
    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.restore();
  };

  this.recalculateGround = function() {
    if (this.onGround) {
      var segment = this.currentSegment.whereIs([this.x, this.y]);
      if (this.currentSegment != undefined && this.currentSegment != segment) {
        this.currentSegment = segment;var pos = this.currentSegment.getPositionAbove([this.x, this.y], this.width / 2);
        // this.x = pos[0];
        // this.y = pos[1];
      }
      if (this.currentSegment == undefined) {
        this.onGround = false;
      }
    }
  };

  this.update = function() {
    if (this.onGround) {
      if (KEYBOARD_STATE['right']) {
        this.x += Math.cos(this.currentSegment.rotation) * MOVEMENT_SPEED;
        this.y += Math.sin(this.currentSegment.rotation) * MOVEMENT_SPEED;
      }
      if (KEYBOARD_STATE['left']) {
        this.x -= Math.cos(this.currentSegment.rotation) * MOVEMENT_SPEED;
        this.y -= Math.sin(this.currentSegment.rotation) * MOVEMENT_SPEED;
      }
      this.recalculateGround();
    }
  };
}