var config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  parent: 'game',
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var protagonist;

function preload() {
  this.load.path = '../assets/json/';
  this.load.multiatlas('spriteMap', 'spriteMap.json');

}

function create() {

}


function update() {

}