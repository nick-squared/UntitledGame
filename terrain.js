function BranchSegment(branch, start, p1, p2) {
  this.branch = branch;
  // Points organized like so: [x, y].
  this.p1 = p1;
  this.p2 = p2;
  this.center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  this.start = start;
  this.length = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  // Stored in radians.
  this.rotation = Math.atan2(this.p2[1] - this.p1[1], this.p2[0] - this.p1[0]);
  this.normal = this.rotation + Math.PI / 2;

  this.left = undefined;
  this.right = undefined;

  this.setLeft = function(targetSegment) {
    this.left = targetSegment;
    targetSegment.right = this;
  };

  this.parallelDisplacement = function (p) {
    // Some fancy dot product right here.
    var hyp = Math.sqrt(Math.pow(p[0] - this.center[0], 2) + Math.pow(p[1] - this.center[1], 2));
    var angle = Math.atan2(p[1] - this.center[1], p[0] - this.center[0]);
    return Math.cos(angle) * hyp;
  };

  this.getPositionAbove = function(x, vDist) {
    x -= this.start;
    var posX = p1[0] + (this.p2[0] - this.p1[0]) / this.length * x;
    var posY = p1[1] + (this.p2[1] - this.p1[1]) / this.length * x;
    return [posX - Math.cos(this.normal) * vDist, posY - Math.sin(this.normal) * vDist];
  };

  this.draw = function(context) {
    context.strokeStyle = "#C47";
    context.beginPath();
    context.moveTo(this.p1[0], this.p1[1]);
    context.lineTo(this.p2[0], this.p2[1]);
    context.stroke();
    context.closePath();

    context.fillStyle = "#FFF";
    context.fillRect(p1[0] - 1, p1[1] - 1, 2, 2);
    context.fillRect(p2[0] - 1, p2[1] - 1, 2, 2);
  };
}

function Branch(indices) {
  this.segments = [];
  this.length = 0;
  for (var i = 0; i < indices.length - 1; i++) {
    var segment = new BranchSegment(this, this.length, indices[i], indices[i + 1]);
    this.length += segment.length;
    if (i > 0) {
      segment.setLeft(this.segments[i-1]);
    }
    this.segments.push(segment);
  }

  this.draw = function(context) {
    for (var i = 0; i < this.segments.length; i++) {
      this.segments[i].draw(context);
    }
  };

  this.getSegment = function(x) {
    if (x < 0 || x > this.length) {
      return false;
    }
    for (var i = 0;i < this.segments.length; i++) {
      if (x - this.segments[i].start < this.segments[i].length) {
        return this.segments[i];
      }
    }
  };
}