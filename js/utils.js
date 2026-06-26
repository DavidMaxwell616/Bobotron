// CANVAS OPS
// ==========
var g_Debug = true;

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

export function randTrinary() {
  return Math.floor(Math.random() * 3) - 1;
}

export function distSq(x1, y1, x2, y2) {
  return square(x2 - x1) + square(y2 - y1);
};

export function square(x) {
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



// LEVEL GENERATOR
// ===============

export function generateLevel(L) {

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
        randomlevel.push(0); // Grunts
        randomlevel.push(0); // Hulks
        randomlevel.push(4 + Math.floor(L / 3)); // Spheroids
        randomlevel.push(0); // Brains
        randomlevel.push(2 + Math.floor(Math.random() * L / 4)); // Quarks
      } else {
        randomlevel.push(Math.floor(Math.random() * 5) + 4); // Grunts
        randomlevel.push(6 + Math.floor(L / 2)); // Hulks
        randomlevel.push(Math.floor(Math.random() * 3)); // Spheroids
      }
      break;
    case L > 27:
      // Normal wave + a few Quarks
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