function Vec2(x, y) {
  this.x = x;
  this.y = y;

  this.copy = function() {
    return new Vec2(this.x, this.y);
  };

  this.add = function(p2) {
    this.x += p2.x;
    this.y += p2.y;
    return this;
  };

  this.subtract = function(p2) {
    this.x -= p2.x;
    this.y -= p2.y;
    return this;
  };

  this.multiply = function(n) {
    this.x *= n;
    this.y *= n;
    return this;
  };

  this.divide = function(n) {
    this.x /= n;
    this.y /= n;
    return this;
  };

  this.magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  this.distance = function(p2) {
    return Math.sqrt(Math.pow(p2.x - this.x, 2) + Math.pow(p2.y - this.y, 2));
  };

  this.direction = function() {
    return Math.atan2(this.y, this.x);
  };

  this.angle = function(p2) {
    return Math.atan2(p2.y - this.y, p2.x - this.x);
  };
}

function linesIntersect(p1, p2, p3, p4) {
  var a1, a2, b1, b2, c1, c2;
  var r1, r2 , r3, r4;
  var denom, offset, num;

  // Compute a1, b1, c1, where line joining points 1 and 2
  // is "a1 x + b1 y + c1 = 0".
  a1 = p2.y - p1.y;
  b1 = p1.x - p2.x;
  c1 = (p2.x * p1.y) - (p1.x * p2.y);

  // Compute r3 and r4.
  r3 = ((a1 * p3.x) + (b1 * p3.y) + c1);
  r4 = ((a1 * p4.x) + (b1 * p4.y) + c1);

  // Check signs of r3 and r4. If both point 3 and point 4 lie on
  // same side of line 1, the line segments do not intersect.
  if ((r3 != 0) && (r4 != 0) && r3 * r4 > 0) {
    return false;
  }

  // Compute a2, b2, c2
  a2 = p4.y - p3.y;
  b2 = p3.x - p4.x;
  c2 = (p4.x * p3.y) - (p3.x * p4.y);

  // Compute r1 and r2
  r1 = (a2 * p1.x) + (b2 * p1.y) + c2;
  r2 = (a2 * p2.x) + (b2 * p2.y) + c2;

  // Check signs of r1 and r2. If both point 1 and point 2 lie
  // on same side of second line segment, the line segments do
  // not intersect.
  if ((r1 != 0) && (r2 != 0) && r1 * r2 > 0) {
    return false;
  }

  //Line segments intersect: compute intersection point.
  denom = (a1 * b2) - (a2 * b1);

  if (denom == 0) {
    return false;
  }

  if (denom < 0) { 
    offset = -denom / 2; 
  } else {
    offset = denom / 2 ;
  }

  // The denom/2 is to get rounding instead of truncating. It
  // is added or subtracted to the numerator, depending upon the
  // sign of the numerator.
  num = (b1 * c2) - (b2 * c1);
  if (num < 0) {
    x = (num - offset) / denom;
  } else {
    x = (num + offset) / denom;
  }

  num = (a2 * c1) - (a1 * c2);
  if (num < 0) {
    y = ( num - offset) / denom;
  } else {
    y = (num + offset) / denom;
  }

  return true;
}

function Rectangle(topLeft, bottomRight) {
  this.topLeft = topLeft;
  this.bottomRight = bottomRight;
  this.center = topLeft.copy().add(bottomRight).divide(2);

  this.width = bottomRight.x - topLeft.x;
  this.height = bottomRight.y - topLeft.y;

  this.topRight = new Vec2(this.bottomRight.x, this.topLeft.y);
  this.bottomLeft = new Vec2(this.topLeft.x, this.bottomRight.y);

  this.pointInside = function(p) {
    return p.x < this.topRight.x && p.x > this.topLeft.x && p.y < this.bottomLeft.y && p.y > this.topLeft.y;
  };

  this.lineIntersect = function(p1, p2) {
    if (this.pointInside(p1) || this.pointInside(p2)) {
      return true;
    }

    // Check the line against the four sides of the box.
    if (linesIntersect(p1, p2, this.topLeft, this.topRight)) {
      return true;
    } else if (linesIntersect(p1, p2, this.topRight, this.bottomRight)) {
      return true;
    } else if (linesIntersect(p1, p2, this.bottomRight, this.bottomLeft)) {
      return true;
    } else if (linesIntersect(p1, p2, this.bottomLeft, this.topLeft)) {
      return true;
    }
    return false;
  };
}