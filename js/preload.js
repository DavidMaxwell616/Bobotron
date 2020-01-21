function preload() {
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.scale.refresh();

  this.load.path = '../assets/json/';
  this.load.multiatlas('spriteMap', 'spriteMap.json');

  this.load.path = '../assets/images/';
  this.load.image('maxxdaddy', 'maxxdaddy.gif');
}
