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
  this.background = TEXTURES['repeating-forest.png'];
  this.pattern = context.createPattern(this.background, 'repeat');

  this.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  this.draw = function() {
    this.context.save();
    this.camera.center(this.game.player.pos.x, this.game.player.pos.y);
    this.camera.translate(this.context);

    // Draw background.
    this.context.fillStyle = this.pattern;
    this.context.fillRect(this.camera.x, this.camera.y, this.width, this.height);

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
    this.drawUI();
  };

  // UI Constants
  this.healthBarTopLeft = new Vec2(10, 10);
  this.maxHeartCount = 5;
  this.heartBarLength = 150;
  this.heartIcon = TEXTURES['heart.png'];
  this.heartScale = this.heartBarLength / (this.heartIcon.width * this.maxHeartCount);
  this.healthPattern = this.context.createPattern(this.heartIcon, 'repeat');

  this.weaponStatusTopLeft = new Vec2(722,462);
  this.currentWeaponMiddle = new Vec2(50, 80);
  this.ammoMiddle = new Vec2(100, 26);
  this.ammoFont = '13px Georgia'
  this.weaponStatusBackground = TEXTURES['weapon-back.png'];
  this.drawUI = function() {
    // Draw health.
    var width = this.heartIcon.width * this.maxHeartCount * 1;// * this.game.player.health;
    this.context.fillStyle = this.healthPattern;
    this.context.save();
    this.context.translate(this.healthBarTopLeft.x, this.healthBarTopLeft.y);
    this.context.scale(this.heartScale, this.heartScale);
    this.context.fillRect(0, 0, width, this.heartIcon.height);
    this.context.restore();

    // Draw weapon stuff
    this.context.save();
    this.context.translate(this.weaponStatusTopLeft.x, this.weaponStatusTopLeft.y);
    this.context.drawImage(this.weaponStatusBackground, 0, 0);
    this.context.font = this.ammoFont;
    var ammo = Math.round(10 * Math.random()); // this.game.player.currentWeapon.ammo;
    var textSize = new Vec2(this.context.measureText(ammo).width, 13);
    this.context.strokeText(ammo, this.ammoMiddle.x - textSize.x / 2, this.ammoMiddle.y + textSize.y / 2);
    this.context.restore();
  };
}

function AnimatedTexture(name, frames, frameDuration, width, height) {
  this.frame = 0;
  this.frames = frames;
  this.currentFrameStep = 0;
  this.frameDuration = frameDuration;
  this.image = TEXTURES[name];
  this.frameWidth = this.image.width / frames;
  this.width = width;
  this.height = height;

  this.update = function() {
    if (this.currentFrameStep++ > this.frameDuration) {
      this.frame = (this.frame + 1) % this.frames;
      this.currentFrameStep = 0;
    }
  };

  this.draw = function(context) {
    context.drawImage(this.image, this.frameWidth * this.frame, 0, this.frameWidth,
                           this.image.height, 0, 0, this.width, this.height);
  };

  this.drawNext = function(context) {
    this.draw(context);
    this.update();
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
