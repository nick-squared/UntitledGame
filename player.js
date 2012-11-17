MAX_SPEED = 15;
JUMP_POWER = 15;
JUMP_ANGLE_VARIATION = Math.PI / 2;
ACCELERATION = 0.8;
DRAG = 0.1;
GRAVITY = 1.4;
MIN_GRAVITY = 0.25;
STICKYNESS = 1.2;

function Player() {
  this.pos = new Vec2(0, 0);
  this.branchPos = 0;
  this.width = 40;
  this.height = 40;
  this.speed = new Vec2(0, 0);
  this.onGround = false;
  this.rotation = 0;
  this.currentSegment = undefined;
  this.texture = new AnimatedTexture('raccoon.png', 4, 2, this.width, this.height);

  this.getBounds = function() {
    var topLeft = this.pos.copy().subtract(new Vec2(this.width / 2, this.height / 2));
    var bottomRight = this.pos.copy().add(new Vec2(this.width / 2, this.height / 2));
    return new Rectangle(topLeft, bottomRight);
  };

  this.getCenter = function() {
    return this.pos.copy().add(new Vec2(this.width / 2, this.height / 2));
  };

  this.draw = function(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(this.rotation);
    context.scale(this.speed.x < 0 ? -1 : 1, 1);
    context.translate(-this.width / 2, -this.height / 2);
    this.texture.drawNext(context);
    context.restore();
  };

  this.recalculateGround = function() {
    if (this.onGround) {
      var pseudoBranchPos = this.branchPos;
      if (this.currentSegment.right == undefined && this.branchPos > this.currentSegment.start + this.currentSegment.length) {
        pseudoBranchPos = this.branchPos - this.width / 2;
      } else if (this.currentSegment.left == undefined && this.branchPos < 0) {
        pseudoBranchPos = this.branchPos + this.width / 2;
      }
      var newSegment = this.currentSegment.branch.getSegment(pseudoBranchPos);
      if (newSegment == undefined) {
        this.fall();
      } else {
        this.currentSegment = newSegment;
        this.pos = this.currentSegment.getPositionAbove(this.branchPos, this.height / 2);
        this.rotation = this.currentSegment.rotation;
      }
    }
  };

  this.distanceFromBranch = function() {
    this.rotation = 0;
    this.pos.x -= this.width / 2 * Math.cos(this.currentSegment.normal);
    this.pos.y -= this.height / 2 * Math.sin(this.currentSegment.normal);
  };

  this.jump = function() {
    if (!this.onGround) {
      return;
    }
    this.distanceFromBranch();
    var jumpDirection = this.currentSegment.normal + JUMP_ANGLE_VARIATION * (this.speed.x / MAX_SPEED);
    this.speed.x = Math.cos(this.currentSegment.rotation) * this.speed.x -
                   Math.cos(this.currentSegment.normal) * JUMP_POWER;
    this.speed.y = Math.sin(this.currentSegment.rotation) * this.speed.x -
                   Math.sin(this.currentSegment.normal) * JUMP_POWER;
    this.onGround = false;
    this.currentSegment = undefined;
  };
  KEY_ACTIONS[87] = [this, this.jump];

  this.fall = function() {
    this.distanceFromBranch();
    var speed = this.speed.x;
    this.speed.x = Math.cos(this.currentSegment.rotation) * speed;
    this.speed.y = Math.sin(this.currentSegment.rotation) * speed;
    this.onGround = false;
    this.currentSegment = undefined;
  };

  this.collide = function(branchSegment) {
    this.onGround = true;
    this.currentSegment = branchSegment;
    var angle = this.speed.direction() - branchSegment.rotation;
    this.speed.x = this.speed.magnitude() * Math.cos(angle);
    this.speed.y = 0;
    this.branchPos = branchSegment.start - branchSegment.parallelDisplacement(this.getCenter());
    this.recalculateGround();
  };

  this.update = function() {
    if (this.onGround) {
      this.branchPos += this.speed.x;

      var force_gravity = GRAVITY * Math.sin(Math.abs(this.currentSegment.rotation) / 2);
      var force_sticky = STICKYNESS * GRAVITY * Math.abs(this.speed.x) / MAX_SPEED;

      if (KEYBOARD_STATE['right']) {
        this.speed.x = Math.min(MAX_SPEED, this.speed.x + ACCELERATION);
      }
      if (KEYBOARD_STATE['left']) {
        this.speed.x = Math.max(-MAX_SPEED, this.speed.x - ACCELERATION);
      }

      if (!KEYBOARD_STATE['right'] && !KEYBOARD_STATE['left'] ||
          KEYBOARD_STATE['right'] && KEYBOARD_STATE['left']) {
        this.speed.x -= this.speed.x * DRAG;
      }

      if (this.currentSegment.upsideDown) {
        if (force_gravity > force_sticky) {
          console.log(force_sticky, force_gravity);
          this.fall();
        }
      } else {
        if (force_gravity > MIN_GRAVITY) {
          this.speed.x += force_gravity * this.currentSegment.lowerDirection;
        }
      }

      this.recalculateGround();
    } else {
      if (KEYBOARD_STATE['right']) {
        this.speed.x = Math.min(MAX_SPEED, this.speed.x + ACCELERATION);
      }
      if (KEYBOARD_STATE['left']) {
        this.speed.x = Math.max(-MAX_SPEED, this.speed.x - ACCELERATION);
      }
      this.speed.y += GRAVITY;
      this.pos.x += this.speed.x;
      this.pos.y += this.speed.y;
    }
  };
}