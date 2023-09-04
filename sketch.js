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
  box.rotateX(2 / 180 * 3.1415);
  box.rotateY(1 / 180 * 3.1415);
  box.rotateZ(2.05 / 180 * 3.1415);

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

          // Draw line
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
    this.dir = [1, 0, 0,  // Direction along x-axis
                0, 1, 0,  // Direction along y-axis
                0, 0, 1]; // Direction along z-axis

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

  rotateX(angle)
  {
    let x = cos(angle);
    let y = sin(angle);

    this.dir = [(this.dir[0]*x - this.dir[3]*y), // X-axis
                (this.dir[1]*x - this.dir[4]*y), 
                (this.dir[2]*x - this.dir[5]*y),
                (this.dir[3]*x + this.dir[0]*y), // Y-axis
                (this.dir[4]*x + this.dir[1]*y), 
                (this.dir[5]*x + this.dir[2]*y),
                (this.dir[6]),                   // Z-axis
                (this.dir[7]),
                (this.dir[8])];
  }

  rotateY(angle)
  {
    let x = cos(angle);
    let y = sin(angle);

    this.dir = [(this.dir[0]*x + this.dir[6]*y), // X-axis
                (this.dir[1]*x + this.dir[7]*y), 
                (this.dir[2]*x + this.dir[8]*y),
                (this.dir[3]),                   // Y-axis
                (this.dir[4]),
                (this.dir[5]),
                (this.dir[6]*x - this.dir[0]*y), // Z-axis
                (this.dir[7]*x - this.dir[1]*y), 
                (this.dir[8]*x - this.dir[2]*y)];
  }

  rotateZ(angle)
  {
    let x = cos(angle);
    let y = sin(angle);

    this.dir = [(this.dir[0]), // X-axis
                (this.dir[1]), 
                (this.dir[2]),
                (this.dir[3] * x + this.dir[6] * y),                   // Y-axis
                (this.dir[4] * x + this.dir[7] * y),
                (this.dir[5] * x + this.dir[8] * y),
                (this.dir[6] * x - this.dir[3] * y), // Z-axis
                (this.dir[7] * x - this.dir[4] * y), 
                (this.dir[8] * x - this.dir[5] * y)];
  }

  updateSquare()
  {
    // Update scene coordinates of points
    for (let i = 0; i < this.pointCount; i++)
    {
      this.pointX[i] = this.pos[0] + (this.dir[0] * this.localX[i] + this.dir[3] * this.localY[i] + this.dir[6] * this.localZ[i]) * this.scale;
      this.pointY[i] = this.pos[1] + (this.dir[1] * this.localX[i] + this.dir[4] * this.localY[i] + this.dir[7] * this.localZ[i]) * this.scale;
      this.pointZ[i] = this.pos[2] + (this.dir[2] * this.localX[i] + this.dir[5] * this.localY[i] + this.dir[8] * this.localZ[i]) * this.scale;
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