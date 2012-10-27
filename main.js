$(function(){
  var rawCanvas = $('#canvas')[0];
  var context = rawCanvas.getContext('2d');

  var game = new Game(rawCanvas, context);
  game.start();
});