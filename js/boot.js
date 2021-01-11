var gameWidth;
var gameHeight;
let shieldTime = 20;
let skull;
let multiplier = 1;
let ammo = 500;
let graphics;
let Protagonist;
let cursors;
let levels;
let playIntro = true;
let score = 0;
let scoreText;
let ammoText;
let shieldText;
let lives = 3;
let livesText;
let level = 1;
let levelText;
let title;
let startGame = false;
let splash;
let xStart = 40;
let yStart = 200;
let xScale = .9;
let yScale = .8;
let objects = [];
let maxxdaddy;
let curScore = 0;
let textTimer;
let guards = [];
let showintro = 1;
let gameOver = false;
const DEAD = 0;
const ALIVE = 1;
let levelBkgd;
let numGuards;
let runTime = 0;
let textTiles;
let levelOver = false;
let levelOverTimer = 0;
let playerXSpeed = 0;
let playerYSpeed = 0;

var rectStep = 5;
var rects;
var rectColor = 0xffffff;
var rectWidth = 10;
var rectCount = 0;
var rectHeight = 5;
var rectDelay = 500;
var colorNum;
var _isRefreshingLevel = false;

const FULL_CIRCLE = Math.PI * 2,
  RADIANS_PER_DEGREE = Math.PI / 180.0,

  wallThickness = 5,
  wallTop = 30,
  wallLeft = 5,
  colors = [];
var wallBottom, wallRight;

var gameState = {
  Menu: 0,
  Transition: 1,
  Playing: 2,
  GameOver: 3
}
//   var g_canvas = document.getElementById("myCanvas");
// var g_ctx = g_canvas.getContext("2d");

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

var colorCounter = 0;

var Brain;
var Child;
var Dad;
var Enforcer;
var Grunt;
var Hulk;
var Mom;
var Prog;
var Quark;
var Spheroid;
var Tank;
var PowerUps;
var BlackDiamond;
var Checkers;
var Diamond;
var Dizzy;
var EnforcerSpark;
var Extralife;
var Rectangle;
var Skull;
var Spark;
var Square;
var Triangle;
var HumanScore;
var levelRendered = false;
var Family;
var Enemies;
var Bullets;
var Particles;
var isMoving = false;
var isGameOver = false;
var Logos;
var Rewards;
var ExtraLives;
var arrowTouched=false;
var playerDying = false;
var arrows =new Array(4);
var arrowStats = [
{
  angle: 0,
yOffset: 0,
xOffset: 30,
direction:'right',
},
{
  angle: 90,
yOffset: 30,
xOffset: 0,
direction:'down',
}  ,
{
  angle: 180,
yOffset: 0,
xOffset: -30,
direction:'left',
}  ,
{
  angle: 270,
yOffset: -30,
xOffset: 0,
direction:'up',
}  
];

var electrodes = {
  0: 'Triangle',
  1: 'Square',
  2: 'Rectangle',
  3: 'Dizzy',
  4: 'Diamond',
  5: 'Checkers',
  6: 'BlackDiamond'
};

//LEVEL STUFF

var _levelSpecs = [
  // Each number in the level array represents how many entities of the
  // corresponding type should be created. There is always one protagonist,
  // so we skip him in the level description
  // Family, Electrodes, Grunts, Hulks, Spheroids, Brains, Quarks (not the Star Trek DS9 version)

  [], // level "0", skipped automatically
  [2, 0, 6],
  [3, 4, 8, 2],
  [5, 6, 10, 4]
];

var scoreValues = {
  Electrode: 5,
  Spark: 25,
  Shell: 50,
  CruiseMissile: 75,
  Prog: 100,
  Grunt: 100,
  Enforcer: 200,
  Tank: 300,
  Brain: 500,
  Spheroid: 1000,
  Quark: 1000,
  Family: 1000,
  Powerup: 300
};

