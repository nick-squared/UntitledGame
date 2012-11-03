MAX_SPEED = 15;
ACCELERATION = 0.8;
DRAG = 0.1;
GRAVITY = 1.4;
MIN_GRAVITY = 0.25;
STICKYNESS = 1.4;

function Player() {
  this.pos = new Vec2(0, 0);
  this.branchPos = 0;
  this.width = 20;
  this.height = 20;
  this.speed = new Vec2(0, 0);
  this.onGround = false;
  this.rotation = 0;
  this.currentSegment = undefined;

  this.getBounds = function() {
    return new Rectangle(this.pos, this.pos.copy().add(new Vec2(this.width, this.height)));
  };

  this.getCenter = function() {
    return this.pos.copy().add(new Vec2(this.width / 2, this.height / 2));
  };

  this.draw = function(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(this.rotation);
    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.fillStyle = "#000";
    context.fillRect(-3, -this.height / 2 + 4, 6, 2);
    context.restore();
  };

  this.recalculateGround = function() {
    if (this.onGround) {
      var newSegment = this.currentSegment.branch.getSegment(this.branchPos);
      if (newSegment == undefined) {
        this.fall();
      } else {
        this.currentSegment = newSegment;
        this.pos = this.currentSegment.getPositionAbove(this.branchPos, this.height / 2);
        this.rotation = this.currentSegment.rotation;
      }
    }
  };

  this.fall = function() {
    this.rotation = 0;
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
      var force_sticky = Math.abs(this.speed.x) / MAX_SPEED * STICKYNESS;

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
          this.fall();
        }
      } else {
        if (force_gravity > MIN_GRAVITY) {
          this.speed.x += force_gravity * this.currentSegment.lowerDirection;
        }
      }

      this.recalculateGround();
    } else {
      this.speed.y += GRAVITY;
      this.pos.x += this.speed.x;
      this.pos.y += this.speed.y;
    }
  };
}