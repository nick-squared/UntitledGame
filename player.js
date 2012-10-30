MOVEMENT_SPEED = 7;

function Player() {
  this.pos = [0, 0];
  this.branchPos = 0;
  this.width = 20;
  this.height = 20;
  this.speed = [0, 0];
  this.onGround = false;
  this.currentSegment = undefined;

  this.draw = function(context) {
    context.save();
    if (this.onGround) {
      context.translate(this.pos[0], this.pos[1]);
      context.rotate(this.currentSegment.normal);
    }
    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.restore();
  };

  this.recalculateGround = function() {
    if (this.onGround) {
      this.currentSegment = this.currentSegment.branch.getSegment(this.branchPos);
      this.pos = this.currentSegment.getPositionAbove(this.branchPos, this.height / 2);
      if (this.currentSegment == undefined) {
        this.onGround = false;
      }
    }
  };

  this.update = function() {
    if (this.onGround) {
      if (KEYBOARD_STATE['right']) {
        this.branchPos += MOVEMENT_SPEED;
      }
      if (KEYBOARD_STATE['left']) {
        this.branchPos -= MOVEMENT_SPEED;
      }
      this.recalculateGround();
    }
  };
}