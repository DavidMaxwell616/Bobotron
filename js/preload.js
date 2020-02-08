function preload() {
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.scale.refresh();

  this.load.path = '../assets/json/';
  this.load.multiatlas('spriteMap', 'spriteMap.json');

  this.load.path = '../assets/images/';
  this.load.image('maxxdaddy', 'maxxdaddy.gif');
    this.load.image('splash', 'robotron splash.png');
    this.load.spritesheet('w', 'williams w.png', {
      frameWidth: 32,
      frameHeight: 32
    });
}
