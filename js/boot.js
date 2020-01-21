const gameWidth = 900;
const gameHeight = 500;

let shieldTime = 20;

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
let curLevel = 1;
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
const FULL_CIRCLE = Math.PI * 2,
  RADIANS_PER_DEGREE = Math.PI / 180.0,

  wallThickness = 5,
  wallTop = 30,
  wallBottom = gameHeight - 5,
  wallLeft = 5,
  wallRight = gameWidth - 5,
  colors = [];

//   var g_canvas = document.getElementById("myCanvas");
// var g_ctx = g_canvas.getContext("2d");

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

// A flag which determines wether the score is eligible
// to be added to the high score list.
var g_hasCheated = false;
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


  