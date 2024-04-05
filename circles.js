const ASC = 0;
const DESC = 0;

let arcs = [];
let rotation = 0;
let maxArcs = 500;
let minArcs = 100;
let flow = ASC;

class Arc {
  constructor(
    x,
    y,
    radius,
    startAngle,
    endAngle,
    counterClockwise,
    lineWidth,
    strokeStyle
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.counterClockwise = counterClockwise;
    this.lineWidth = lineWidth;
    this.strokeStyle = strokeStyle;
    this.startingAngle = startAngle;
    this.endingAngle = endAngle;
    if (this.startAngle == this.endAngle) {
      this.startAngle = 0;
      this.endAngle = 2 * Math.PI;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.arc(
      this.x,
      this.y,
      this.radius,
      this.startAngle,
      this.endAngle,
      this.counterClockwise
    );
    ctx.stroke();
    ctx.closePath();
  }

  animate() {
    if (this.counterClockwise) {
      this.startAngle = this.startingAngle - rotation;
      this.endAngle = this.endingAngle - rotation;
    } else {
      this.startAngle = this.startingAngle + rotation;
      this.endAngle = this.endingAngle + rotation;
    }
  }
}

let fpsController = 0;

const maxRadius = window.innerWidth / 2 + window.innerWidth / 12;
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomBrightness(radius) {
  let probabilityWhite = 0.2;
  let random = Math.random();
  if (random < probabilityWhite) {
    return 100;
  } else {
    return getRandomInt(0, 80);
  }
}
function getSaturation(radius) {
  let proportion = (maxRadius - radius) / maxRadius;
  let chanceOfGray = 0.2;
  let random = Math.random();
  if (random < chanceOfGray) {
    return 0;
  } else {
    let min = proportion * 100;
    let max = 100;
    return getRandomInt(min, max);
  }
}
function getHue(radius) {
  let proportion = (maxRadius - radius) / maxRadius;
  return proportion * 720;
}
function getRandomRad() {
  let degrees = 360 * Math.random();
  degrees = roundToNearest(degrees, 45);
  return (degrees * Math.PI) / 180;
}
function roundToNearest(value, interval) {
  return Math.round(value / interval) * interval;
}
function addArc() {
  let x = 1;
  let y = 1;
  let radius = Math.floor(Math.random() * maxRadius);
  radius = Math.sin((Math.random() * Math.PI) / 2) * maxRadius;
  let startAngle = getRandomRad();
  let endAngle = getRandomRad();
  let lineWidth = Math.floor(Math.random() * 10 * (radius / (maxRadius / 2)));
  let counterClockwise = startAngle > endAngle;
  let brightness = `${getRandomBrightness(radius)}%`;
  let saturation = `${getSaturation(radius)}%`;
  let hue = `${getHue(radius)}`;
  let strokeStyle = `hsl(${hue}, ${saturation}, ${brightness})`;
  let arc = new Arc(
    x,
    y,
    radius,
    startAngle,
    endAngle,
    counterClockwise,
    lineWidth,
    strokeStyle
  );
  arcs.push(arc);
}
const drawRandomArc = (ctx) => {
  fpsController++;
  rotation += 0.01;
  addNewArc = true;
  if (fpsController % 4) {
    // window.requestAnimationFrame(() => drawRandomArc(ctx));1
    addNewArc = false;
  }
  if (addNewArc) {
    if (flow == ASC) {
      addArc();
    } else {
      if (arcs.length > 0) {
        arcs.shift();
      }
    }
  }

  if (arcs.length >= maxArcs) {
    flow = DESC;
  }
  if (arcs.length <= minArcs) {
    flow = ASC;
  }

  ctx.clearRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  console.log(arcs.length);
  arcs.forEach((arc) => {
    arc.animate();
    arc.draw(ctx);
  });
  // drawOutline(ctx, x, y, radius, startAngle, endAngle, counterClockwise);
  window.requestAnimationFrame(() => drawRandomArc(ctx));
};

const drawOutline = (
  ctx,
  x,
  y,
  radius,
  startAngle,
  endAngle,
  counterClockwise
) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
  ctx.stroke();
  ctx.closePath();
};

window.addEventListener("DOMContentLoaded", function () {
  let canvas = document.getElementById("canvas");
  canvas.width = `${window.innerWidth}`;
  canvas.height = `${window.innerHeight}`;
  let ctx = canvas.getContext("2d");
  ctx.translate(canvas.width / 2, canvas.height / 2);
  window.requestAnimationFrame(() => drawRandomArc(ctx));
});
