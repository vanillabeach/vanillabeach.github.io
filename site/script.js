class Point {
  x;
  y;
  xSpeed;
  ySpeed;

  constructor(args) {
    const { x, y, xSpeed, ySpeed } = args;
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }
}

class Sparkle {
  backgroundColor;
  canvasElement;
  canvasContext;
  distanceThreshold;
  colorA;
  colorB;
  intervalId;
  numberOfPoints;
  pointsArray;
  resolution;
  speedRange;

  static getNumberOfPoints() {
    const throttle = 20000;
    return Math.min((screen.width * screen.height) / throttle, 75);
  }

  constructor(args) {
    this.canvasElement = args.canvasElement;
    this.numberOfPoints = Sparkle.getNumberOfPoints();
    this.colorA = args.colorA;
    this.colorB = args.colorB;
    this.distanceThreshold = args.distanceThreshold;
    this.canvasContext = this.canvasElement.getContext('2d', {
      alpha: 'false',
    });
    this.resolution = args.resolution || 1;
    this.speedRange = args.speedRange || 1;
    this.backgroundColor = args.backgroundColor || '#222222';

    this.setSize();
    this.start();
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('resize', this.setSize.bind(this));
  }

  drawVector(
    pointAx,
    pointAy,
    pointBx,
    pointBy,
    pointCx,
    pointCy,
    intensity,
    colorToggle
  ) {
    const ctx = this.canvasContext;

    ctx.fillStyle = `rgba(
        ${colorToggle == true ? this.colorA[0] : this.colorB[0]},
        ${colorToggle == true ? this.colorA[1] : this.colorB[1]},
        ${colorToggle == true ? this.colorA[2] : this.colorB[2]},
        ${intensity}
      )`;
    ctx.beginPath();
    ctx.moveTo(pointAx, pointAy);
    ctx.lineTo(pointBx, pointBy);
    ctx.lineTo(pointCx, pointCy);
    ctx.closePath();
    ctx.fill();
  }

  animate() {
    const maxWidth = parseInt(this.canvasElement.getAttribute('width'), 10);
    const maxHeight = parseInt(this.canvasElement.getAttribute('height'), 10);
    const distanceThreshold = this.distanceThreshold;

    this.paintBackground();

    this.pointsArray.forEach((pointA, index) => {
      for (let pointB of this.pointsArray) {
        const abx = pointA.x - pointB.x;
        const aby = pointA.y - pointB.y;
        const distanceAB = parseInt(Math.sqrt(abx * abx + aby * aby), 10);
        if (distanceAB > distanceThreshold) {
          continue;
        }

        for (let pointC of this.pointsArray) {
          const acx = pointA.x - pointC.x;
          const acy = pointA.y - pointC.y;
          const distanceAC = parseInt(Math.sqrt(acx * acx + acy * acy), 10);
          if (distanceAC > distanceThreshold) {
            continue;
          }

          const bcx = pointB.x - pointC.x;
          const bcy = pointB.y - pointC.y;
          const distanceBC = parseInt(Math.sqrt(bcx * bcx + bcy * bcy), 10);
          if (distanceBC > distanceThreshold) {
            continue;
          }
          const longestDistance = [distanceAB, distanceAC, distanceBC].reduce(
            (x, y) => Math.max(x, y)
          );
          const intensity = 1 - longestDistance / distanceThreshold;

          this.drawVector(
            pointA.x,
            pointA.y,
            pointB.x,
            pointB.y,
            pointC.x,
            pointC.y,
            intensity,
            index % 2 === 0
          );
        }
      }

      pointA.x = (pointA.x + pointA.xSpeed) % (maxWidth + maxWidth * 0.1);
      pointA.y = (pointA.y + pointA.ySpeed) % (maxHeight + maxHeight * 0.1);

      if (pointA.x < screen.width / -10) pointA.x = maxWidth;
      if (pointA.y < screen.height / -10) pointA.y = maxHeight;
    });
  }

  paintBackground() {
    const ctx = this.canvasContext;
    const { width, height } = this.canvasElement;

    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  setSize() {
    this.canvasElement.setAttribute(
      'width',
      window.innerWidth / this.resolution
    );
    this.canvasElement.setAttribute(
      'height',
      window.innerHeight / this.resolution
    );
    this.numberOfPoints = Sparkle.getNumberOfPoints();
    this.resetPoints();
  }

  start() {
    this.intervalId = window.requestAnimationFrame(() => {
      this.animate();
      this.start();
    });
  }

  stop() {
    window.cancelAnimationFrame(this.intervalId);
  }

  resetPoints() {
    const isEven = () => Math.round(Math.random() * 10) % 2 === 0;
    const maxWidth = parseInt(this.canvasElement.getAttribute('width'), 10);
    const maxHeight = parseInt(this.canvasElement.getAttribute('height'), 10);

    this.pointsArray = [];

    for (let count = 0; count < this.numberOfPoints; count += 1) {
      const startX = Math.random() * maxWidth;
      const startY = Math.random() * maxHeight;
      const xSpeed = Math.random() * this.speedRange * (isEven() ? 1 : -1);
      const ySpeed = Math.random() * this.speedRange * (isEven() ? 1 : -1);

      this.pointsArray.push(
        new Point({ x: startX, y: startY, xSpeed: xSpeed, ySpeed: ySpeed })
      );
    }
  }
}

(function () {
  const sparkleCanvasElement1 = document.getElementById('sparkle-1');
  const sparkleCanvasElement2 = document.getElementById('sparkle-2');

  const resolution = 4;
  const distanceThreshold = 50;

  const baseArgs = {
    distanceThreshold: distanceThreshold,
    resolution: resolution,
    speedRange: 1,
  };

  new Sparkle({
    canvasElement: sparkleCanvasElement1,
    colorA: [255, 255, 255],
    colorB: [0, 0, 0],
    ...baseArgs,
  });

  new Sparkle({
    canvasElement: sparkleCanvasElement2,
    colorA: [128, 128, 160],
    colorB: [0, 0, 0],
    ...baseArgs,
  });
})();
