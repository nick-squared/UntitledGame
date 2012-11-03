function BranchSegment(branch, start, p1, p2) {
  this.branch = branch;
  this.p1 = p1;
  this.p2 = p2;
  this.center = p1.copy().add(p2).divide(2);
  this.length = p1.distance(p2);
  this.start = start;
  // Stored in radians.
  this.rotation = p1.angle(p2);
  this.normal = this.rotation + Math.PI / 2;
  // 0 is down and is positive clockwise, negative anti-clockwise.
  this.upsideDown = Math.abs(this.rotation) > Math.PI / 2;
  // Which way will objects roll down?
  this.lowerDirection = this.rotation >= 0 ? 1 : -1;

  this.left = undefined;
  this.right = undefined;

  this.setLeft = function(targetSegment) {
    this.left = targetSegment;
    targetSegment.right = this;
  };

  this.collide = function(r) {
    return r.lineIntersect(this.p2, this.p1);
  };

  this.parallelDisplacement = function (p) {
    // Some fancy dot product right here.
    var hyp = p.distance(this.center);
    var angle = p.angle(this.center);
    return Math.cos(angle) * hyp;
  };

  this.getPositionAbove = function(x, vDist) {
    x -= this.start;
    var posX = p1.x + (this.p2.x - this.p1.x) / this.length * x;
    var posY = p1.y + (this.p2.y - this.p1.y) / this.length * x;
    return new Vec2(posX - Math.cos(this.normal) * vDist, posY - Math.sin(this.normal) * vDist);
  };

  this.draw = function(context) {
    context.strokeStyle = "#094";
    context.beginPath();
    context.moveTo(this.p1.x, this.p1.y);
    context.lineTo(this.p2.x, this.p2.y);
    context.stroke();
    context.closePath();

    context.fillStyle = "#FFF";
    context.fillRect(p1.x - 1, p1.y - 1, 2, 2);
    context.fillRect(p2.x - 1, p2.y - 1, 2, 2);
  };
}

function Branch(indices) {
  this.segments = [];
  this.length = 0;

  var topLeft = indices[0].copy();
  var bottomRight = indices[0].copy();
  for (var i = 0; i < indices.length - 1; i++) {
    topLeft.x = Math.min(topLeft.x, indices[i + 1].x);
    topLeft.y = Math.min(topLeft.y, indices[i + 1].y);
    bottomRight.x = Math.max(bottomRight.x, indices[i + 1].x);
    bottomRight.y = Math.max(bottomRight.y, indices[i + 1].y);

    var segment = new BranchSegment(this, this.length, indices[i], indices[i + 1]);
    this.length += segment.length;
    if (i > 0) {
      segment.setLeft(this.segments[i-1]);
    }
    this.segments.push(segment);
  }
  this.bounds = new Rectangle(topLeft, bottomRight);

  this.draw = function(context) {
    for (var i = 0; i < this.segments.length; i++) {
      this.segments[i].draw(context);
    }
  };

  this.collide = function(r) {
    for (var i = 0;i < this.segments.length; i++) {
      if (this.segments[i].collide(r)) {
        return this.segments[i];
      }
    }
  };

  this.getSegment = function(x) {
    if (x < 0 || x > this.length) {
      return undefined;
    }
    for (var i = 0;i < this.segments.length; i++) {
      if (x - this.segments[i].start < this.segments[i].length) {
        return this.segments[i];
      }
    }
  };
}