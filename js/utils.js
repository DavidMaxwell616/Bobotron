// CANVAS OPS
// ==========

function clearCanvas(ctx) {
  var prevfillStyle = ctx.fillStyle;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = prevfillStyle;

  //Display the color array
  /*ctx.save();
  for (var i = 0; i < consts.colors.length; i++) {
      ctx.fillStyle = consts.colors[i];
      ctx.fillRect(i*(g_canvas.width / consts.colors.length), 550, 
                  (i+1)*(g_canvas.width / consts.colors.length), 50
      );
  }
  ctx.restore();*/
};

function distSq(x1, y1, x2, y2) {
  return square(x2 - x1) + square(y2 - y1);
};

function square(x) {
  return x * x;
};

function strokeCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
};

function fillCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

function fillBox(ctx, x, y, w, h, style) {
  var oldStyle = ctx.fillStyle;
  ctx.fillStyle = style;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = oldStyle;
};

function RGB2Color(r, g, b) {
  return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
};

function byte2Hex(n) {
  return String("0123456789ABCDEF".substr((n >> 4) & 0x0F, 1)) + "0123456789ABCDEF".substr(n & 0x0F, 1);
};

//Called when initializing the game
function makeColorArray() {
  for (var i = 0; i < 32; ++i) {
    var r = Math.sin(0.2 * i + 0) * 127 + 128;
    var g = Math.sin(0.2 * i + 2) * 127 + 128;
    var b = Math.sin(0.2 * i + 4) * 127 + 128;
    colors.push(this.RGB2Color(r, g, b));
  }
};

function addMultiplier() {
  if (multiplier < 5)
    multiplier += 1;
};

function resetMultiplier() {
  multiplier = 1;
};

// LEVEL GENERATOR
// ===============

function generateLevel(L) {

  var randomlevel = [];

  switch (true) {
    case (L + 1) % 10 === 0:
      // Grunt wave
      if (g_Debug) console.log("grunts");
      randomlevel.push(10); // Family
      randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
      randomlevel.push(Math.floor(Math.random() * 6) + 2 * L); // Grunts
      randomlevel.push(Math.floor(Math.random() * 5)); // Hulks
      break;
    case L % 5 === 0:
      // Brain wave (hur hur)
      if (g_Debug) console.log("brains");
      randomlevel.push(15); // Family
      randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
      randomlevel.push(Math.floor(Math.random() * 5) + 4); // Grunts
      randomlevel.push(0); // Hulks
      randomlevel.push(0); // Spheroids
      randomlevel.push(Math.floor(Math.random() * 7) + Math.floor(L / 5)); // Brains
      break;
    case (L + 3) % 5 === 0:
      // Tank wave
      if (g_Debug) console.log("tanks");
      randomlevel.push(10); // Family
      randomlevel.push(0); // Electrodes
      randomlevel.push(0); // Grunts
      randomlevel.push(3 + Math.floor(L / 2)); // Hulks
      randomlevel.push(0); // Spheroids
      randomlevel.push(0); // Brains
      randomlevel.push(Math.floor(L / 2)); // Quarks
      break;
    case (L + 6) % 10 === 0:
      // Hulk wave or Enforcer/Tank wave
      randomlevel.push(10); // Family
      randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
      if (Math.random() < 0.5) {
        if (g_Debug) console.log("enforcers/tanks");
        randomlevel.push(0); // Grunts
        randomlevel.push(0); // Hulks
        randomlevel.push(4 + Math.floor(L / 3)); // Spheroids
        randomlevel.push(0); // Brains
        randomlevel.push(2 + Math.floor(Math.random() * L / 4)); // Quarks
      } else {
        if (g_Debug) console.log("hulks");
        randomlevel.push(Math.floor(Math.random() * 5) + 4); // Grunts
        randomlevel.push(6 + Math.floor(L / 2)); // Hulks
        randomlevel.push(Math.floor(Math.random() * 3)); // Spheroids
      }
      break;
    case L > 27:
      // Normal wave + a few Quarks
      if (g_Debug) console.log("normal+");
      randomlevel.push(10); // Family
      randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
      randomlevel.push(Math.floor(Math.random() * 6) + L); // Grunts
      randomlevel.push(Math.floor(Math.random() * 6) + Math.floor(L / 10)); // Hulks
      randomlevel.push(Math.floor(Math.random() * 3)); // Spheroids
      randomlevel.push(0); // Brains
      randomlevel.push(Math.floor(Math.random() * 3)); // Quarks
      break;
    default:
      // Normal wave
      if (g_Debug) console.log("normal");
      randomlevel.push(10); // Family
      randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
      randomlevel.push(Math.floor(Math.random() * 6) + L); // Grunts
      randomlevel.push(Math.floor(Math.random() * 6) + Math.floor(L / 10)); // Hulks
      randomlevel.push(Math.floor(Math.random() * 3)); // Spheroids
  }

  if (g_Debug) {
    console.log("This level consists of:", randomlevel);
    console.log("Key: [Family, Electrodes, Grunts, Hulks, Spheroids, Brains, Quarks]");
    console.log("");
  }

  return randomlevel;
};