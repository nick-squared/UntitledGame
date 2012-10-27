var KEYBOARD_STATE = {
  'up': false,
  'down': false,
  'right': false,
  'left': false
};

$(function(){
  var rawCanvas = $('#canvas')[0];
  var context = rawCanvas.getContext('2d');

  var game = new Game(rawCanvas, context);
  game.start();
});

$(window).keydown(function(event) {
  var keycode = event.which;
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