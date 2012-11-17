var KEYBOARD_STATE = {
  'up': false,
  'down': false,
  'right': false,
  'left': false
};

var KEY_ACTIONS = {}; // [Object, function]

var TEXTURES = {};

$(function(){
  loadTextures();
});

$(window).keydown(function(event) {
  var keycode = event.which;
  if (KEY_ACTIONS.hasOwnProperty(keycode)) {
    KEY_ACTIONS[keycode][1].call(KEY_ACTIONS[keycode][0]);
  }
  if (keycode == 65) {
    KEYBOARD_STATE['left'] = true;
  } else if (keycode == 87) {
    KEYBOARD_STATE['up'] = true;
  } else if (keycode == 68) {
    KEYBOARD_STATE['right'] = true;
  } else if (keycode == 83) {
    KEYBOARD_STATE['down'] = true;
  }
});

$(window).keyup(function(event) {
  var keycode = event.which;
  if (keycode == 65) {
    KEYBOARD_STATE['left'] = false;
  } else if (keycode == 87) {
    KEYBOARD_STATE['up'] = false;
  } else if (keycode == 68) {
    KEYBOARD_STATE['right'] = false;
  } else if (keycode == 83) {
    KEYBOARD_STATE['down'] = false;
  }
});

function startGame() {
  var rawCanvas = $('#canvas')[0];
  var context = rawCanvas.getContext('2d');

  var game = new Game(rawCanvas, context);
  game.start();
}
function loadTextures() {
  var texturesLoaded = 0;
  var files = ['background.jpg', 'raccoon.png', 'repeating-forest.png'];
  for (var i = 0; i < files.length; i++) {
    var img = new Image();
    img.onload = function(e) {
      TEXTURES[this.key] = this;
      texturesLoaded ++;
      if (texturesLoaded == files.length) {
        startGame();
      }
    };
    img.key = files[i];
    img.src = files[i];
  }
}