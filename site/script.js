class Point {
  x;
  y;
  speed;

  constructor(x, y, xSpeed = 1, ySpeed = 1) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }
}

class Sparkle {
  canvasElement;
  canvasContext;
  numberOfPoints;
  pointsArray;
  intervalId;

  constructor(canvasElement, numberOfPoints) {
    this.canvasElement = canvasElement;
    this.numberOfPoints = numberOfPoints;
    this.canvasContext = this.canvasElement.getContext('2d');

    this.setInitialPoints();
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
    const _whiteStone = [255, 255, 255];
    const _blackStone = [0, 0, 0];

    ctx.fillStyle = '#002288';
    ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    ctx.fillStyle = `rgba(
        ${colorToggle == true ? _whiteStone[0] : _blackStone[0]},
        ${colorToggle == true ? _whiteStone[1] : _blackStone[1]},
        ${colorToggle == true ? _whiteStone[2] : _blackStone[2]},
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
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const distanceThreshold = 100;

    this.pointsArray.forEach((pointA, index) => {
      // Paint
      this.pointsArray.forEach((pointB) => {
        const abx = pointA.x - pointB.x;
        const aby = pointA.y - pointB.y;
        const distanceAB = parseInt(Math.sqrt(abx * abx + aby * aby), 10);
        if (distanceAB > distanceThreshold) {
          return;
        }

        this.pointsArray.forEach((pointC) => {
          const acx = pointA.x - pointC.x;
          const acy = pointA.y - pointC.y;
          const distanceAC = parseInt(Math.sqrt(acx * acx + acy * acy), 10);
          if (distanceAC > distanceThreshold) {
            return;
          }

          const bcx = pointB.x - pointC.x;
          const bcy = pointB.y - pointC.y;
          const distanceBC = parseInt(Math.sqrt(bcx * bcx + bcy * bcy), 10);
          if (distanceBC > distanceThreshold) {
            return;
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
        });
      });

      // Move Point
      pointA.x = (pointA.x + pointA.xSpeed) % screenWidth;
      pointA.y = (pointA.y + pointA.ySpeed) % screenHeight;

      if (pointA.x < 0) pointA.x = screenWidth;
      if (pointA.y < 0) pointA.y = screenHeight;
    });
  }

  setSize() {
    this.canvasElement.setAttribute('width', window.innerWidth);
    this.canvasElement.setAttribute('height', window.innerHeight);
  }

  start() {
    this.intervalId = window.setInterval(this.animate.bind(this), 10);
  }

  stop() {
    window.clearInterval(this.intervalId);
  }

  setInitialPoints() {
    const isEven = () => Math.round(Math.random() * 10) % 2 === 0;
    this.pointsArray = [];
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let count = 0; count < this.numberOfPoints; count += 1) {
      const startX = Math.random() * screenWidth;
      const startY = Math.random() * screenHeight;
      const xSpeed = Math.random() * 5 * (isEven() ? 1 : -1);
      const ySpeed = Math.random() * 5 * (isEven() ? 1 : -1);

      this.pointsArray.push(new Point(startX, startY, xSpeed, ySpeed));
    }
  }
}

(function () {
  const sparkleCanvasElement = document.getElementById('sparkle');
  const numberOfPoints = 100;

  new Sparkle(sparkleCanvasElement, numberOfPoints);
})();
