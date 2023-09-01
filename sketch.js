// Variable to move objects on the screen
let n = 1;

// Camera variables
let moveSpeed = 5;
let screenDist = 150;

// Set screen size
let width = 400;
let height = 400;

function setup() 
{
  createCanvas(width, height);

  // Create camera
  cam = new Camera(0, 0, 200);

  // Create Box
  box = new Box(0, 0, 0, 100, 200, 50);
}

function draw() 
{
  // Set properties of project
  background(40);
  stroke(230);

  n += 0.05;

  // Set properties of the box
  box.setRotation(n / 3);

  // Update camera
  cam.move((keyIsDown(65) - keyIsDown(68))    * moveSpeed,
           (keyIsDown(32) - keyIsDown(SHIFT)) * moveSpeed,
           (keyIsDown(83) - keyIsDown(87))    * moveSpeed);

  box.updateSquare();
  cam.draw(box.getPointsX(), box.getPointsY(), box.getPointsZ());
}

class Camera
{
  constructor(x, y, z)
  {
    // Set coordinate of camera
    this.pos = [x, y, z];
  }

  move(x, y, z)
  {
    this.pos[0] += x;
    this.pos[1] += y;
    this.pos[2] += z;
  }

  draw(arrX, arrY, arrZ)
  {
    for (let i = 0; i < arrX.length - 1; i++)
    {
      for (let j = i + 1; j < arrX.length; j++)
      {
        if (arrZ[j] < this.pos[2] && arrZ[i] < this.pos[2])
        {
          // Set variables for start point of line
          let sx = arrX[i];
          let sy = arrY[i];
          let sz = arrZ[i];

          // Set variables for end point of line
          let ex = arrX[j];
          let ey = arrY[j];
          let ez = arrZ[j];

          // Get coordinates for points on the scene
          let x1 = (screenDist * (sx - this.pos[0])) / (sz - this.pos[2]) + width / 2;
          let y1 = (screenDist * (sy - this.pos[1])) / (sz - this.pos[2]) + height / 2;
          let x2 = (screenDist * (ex - this.pos[0])) / (ez - this.pos[2]) + width / 2;
          let y2 = (screenDist * (ey - this.pos[1])) / (ez - this.pos[2]) + height / 2;

          line(x1, y1, x2, y2);
        }
      }
    }
  }
}

class Object 
{
  constructor(pointCount) 
  {
    this.pos = [0, 0];

    this.scale = 1;
    this.dir = [1, 0];

    this.pointCount = pointCount;

    this.localX = new Array(pointCount);
    this.localY = new Array(pointCount);
    this.localZ = new Array(pointCount);

    this.pointX = new Array(pointCount);
    this.pointY = new Array(pointCount);
    this.pointZ = new Array(pointCount);
  }

  draw()
  {
    line(this.pointX[0], this.pointY[0], this.pointX[1], this.pointY[1]);
    line(this.pointX[1], this.pointY[1], this.pointX[2], this.pointY[2]);
    line(this.pointX[2], this.pointY[2], this.pointX[3], this.pointY[3]);
    line(this.pointX[3], this.pointY[3], this.pointX[0], this.pointY[0]);
  }

  setScale(s)
  {
    this.scale = s;
  }

  setPos(x, y)
  {
    this.pos = [x, y];
  }

  setRotation(angle)
  {
    this.dir = [cos(angle), sin(angle)];
  }

  updateSquare()
  {
    // Update scene coordinates of points
    for (let i = 0; i < this.pointCount; i++)
    {
      this.pointX[i] = this.pos[0] + this.dir[0] * (this.localX[i] * this.scale) - this.dir[1] * (this.localY[i] * this.scale);
      this.pointY[i] = this.pos[1] + this.dir[0] * (this.localY[i] * this.scale) + this.dir[1] * (this.localX[i] * this.scale);
      this.pointZ[i] = this.pos[2] + this.localZ[i];
    }
  }

  getPointsX()
  {
    return this.pointX;
  }

  getPointsY()
  {
    return this.pointY;
  }

  getPointsZ()
  {
    return this.pointZ;
  }

  setLocalPoints(x, y, z)
  {
    this.localX = x;
    this.localY = y;
    this.localZ = z;
  }
}

class Box extends Object
{
  constructor(x, y, z, h, w, d)
  {
    super(8);

    // Coordinate of center
    super.pos = [x, y, z];

    // Coordinate of local points
    let localX = [-w / 2,  w / 2,
                   w / 2, -w / 2,
                  -w / 2,  w / 2,
                   w / 2, -w / 2];

    let localY = [ h / 2,  h / 2,
                  -h / 2, -h / 2,
                  -h / 2, -h / 2,
                   h / 2,  h / 2];

    let localZ = [d/2,  d/2,  d/2,  d/2, 
                 -d/2, -d/2, -d/2, -d/2];

    super.setLocalPoints(localX, localY, localZ);
    super.updateSquare();
  }
}