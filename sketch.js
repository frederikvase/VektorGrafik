////////////////////////////
///3D Lighting Simulation///
////////////////////////////

// Visual variables
let noStroke = true;
let pointLight = true;
let setToRandomColor = true;
let rotateBox = true;

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
  box = new Box(0, 0, 0, 200, 100, 50);

  box2 = new Box(300, 20, 0, 200, 200, 50);

  box.rotateX(20 / 180 * 3.1415);
  box.rotateY(30 / 180 * 3.1415);
  box.rotateZ(30 / 180 * 3.1415);

  // Set box to random color
  if (setToRandomColor)
    box.setColor([255, 0, 255]);
}

function draw() 
{
  // Set properties of project
  background(40);

  // Set properties of the box
  if (rotateBox)
  {
    //box.rotateX(2 / 180 * 3.1415);
    box.rotateY(1 / 180 * 3.1415);
    box.rotateZ(0.7 / 180 * 3.1415);
    box2.rotateZ(0.7 / 180 * 3.1415);
  }
  
  // Update camera
  cam.move((keyIsDown(65) - keyIsDown(68))    * moveSpeed,
           (keyIsDown(32) - keyIsDown(SHIFT)) * moveSpeed,
           (keyIsDown(83) - keyIsDown(87))    * moveSpeed);

  box.updateSquare();
  box2.updateSquare();
  cam.draw(box.getPointsX(), box.getPointsY(), box.getPointsZ(), box.getTriArr(), box.getColor());
  cam.draw(box2.getPointsX(), box2.getPointsY(), box2.getPointsZ(), box2.getTriArr(), box2.getColor());
}

function cross(x1, y1, z1, x2, y2, z2)
{
  return {
    x: y1 * z2 - z1 * y2, 
    y: z1 * x2 - x1 * z2, 
    z: x1 * y2 - y1 * x2
  };
}

function dot(v1, v2)
{
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function length(v)
{
  return sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
}

class Camera
{
  constructor(x, y, z)
  {
    // Set coordinate of camera
    this.pos = {x: x, y: y, z: z};
  }

  move(x, y, z)
  {
    this.pos.x += x;
    this.pos.y += y;
    this.pos.z += z;
  }

  draw(arrX, arrY, arrZ, triArr, color)
  {
    for(let i = 0; i < triArr.length; i++)
    {
      // Set variables for corner 1
      let c1 = {
        x: arrX[triArr[i][0]],
        y: arrY[triArr[i][0]],
        z: arrZ[triArr[i][0]]
      };

      // Set variables for corner 2
      let c2 = {
        x: arrX[triArr[i][1]],
        y: arrY[triArr[i][1]],
        z: arrZ[triArr[i][1]]
      };

      // Set variables for corner 2
      let c3 = {
        x: arrX[triArr[i][2]],
        y: arrY[triArr[i][2]],
        z: arrZ[triArr[i][2]]
      };

      let n = cross(c2.x - c1.x, c2.y - c1.y, c2.z - c1.z, 
                    c3.x - c1.x, c3.y - c1.y, c3.z - c1.z);

      let viewDir = {
        x: c1.x - this.pos.x,
        y: c1.y - this.pos.y,
        z: c1.z - this.pos.z 
      };

      // If the dot product between the view direction and the normal- 
      // vector is greater than zero the face should be drawn
      if (dot(viewDir, n) > 0)
      {
        // Calculate coordinates for points on the screen
        let x1 = (screenDist * (c1.x - this.pos.x)) / (c1.z - this.pos.z) + width  / 2;
        let y1 = (screenDist * (c1.y - this.pos.y)) / (c1.z - this.pos.z) + height / 2;
        let x2 = (screenDist * (c2.x - this.pos.x)) / (c2.z - this.pos.z) + width  / 2;
        let y2 = (screenDist * (c2.y - this.pos.y)) / (c2.z - this.pos.z) + height / 2;
        let x3 = (screenDist * (c3.x - this.pos.x)) / (c3.z - this.pos.z) + width  / 2;
        let y3 = (screenDist * (c3.y - this.pos.y)) / (c3.z - this.pos.z) + width / 2;

        // Calculate lighting
        let lightVec = {
          x: this.pos.x - c1.x - (mouseX - width / 2),
          y: this.pos.y - c1.y - (mouseY - height / 2),
          z: this.pos.z - c1.z  
        };

        let intensity;
        if (pointLight)
          intensity = -dot(lightVec, n) / (length(n) * length(lightVec)); 
        else
          intensity = -n.z / length(n);

        // Draw triangle 
        push();       
         
        fill(color[0] * intensity, color[1] * intensity, color[2] * intensity);
        if (noStroke) stroke(color[0] * intensity, color[1] * intensity, color[2] * intensity);

        triangle(x1, y1, x2, y2, x3, y3);
        pop();
      }  
    }
  }
}

class Object 
{
  constructor(pointCount) 
  {
    this.pos = [0, 0];

    this.scale = {x: 1, y: 1, z: 1};

    this.dir = [1, 0, 0,  // Direction along x-axis
                0, 1, 0,  // Direction along y-axis
                0, 0, 1]; // Direction along z-axis

    this.color = [255, 255, 255];

    this.pointCount = pointCount;

    this.localX = new Array(pointCount);
    this.localY = new Array(pointCount);
    this.localZ = new Array(pointCount);

    this.pointX = new Array(pointCount);
    this.pointY = new Array(pointCount);
    this.pointZ = new Array(pointCount);

    this.triArr = [];
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
    this.scale.x = s;
    this.scale.y = s;
    this.scale.z = s;
  }

  setScaleX(x)
  {
    this.scale.x = x;
  }

  setScaleY(y)
  {
    this.scale.x = y;
  }

  setScaleZ(z)
  {
    this.scale.x = z;
  }

  setTriArr(arr)
  {
    this.triArr = arr;
  }

  getTriArr()
  {
    return this.triArr;
  }

  setColor(color)
  {
    this.color = color;
  }

  getColor()
  {
    return this.color;
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
      this.pointX[i] = this.pos[0] + (this.dir[0] * this.localX[i]) * this.scale.x + (this.dir[3] * this.localY[i]) * this.scale.y + (this.dir[6] * this.localZ[i]) * this.scale.z;
      this.pointY[i] = this.pos[1] + (this.dir[1] * this.localX[i]) * this.scale.x + (this.dir[4] * this.localY[i]) * this.scale.y + (this.dir[7] * this.localZ[i]) * this.scale.z;
      this.pointZ[i] = this.pos[2] + (this.dir[2] * this.localX[i]) * this.scale.x + (this.dir[5] * this.localY[i]) * this.scale.y + (this.dir[8] * this.localZ[i]) * this.scale.z;
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

    super.setTriArr([
        [0, 2, 3],
        [0, 1, 2],
        [0, 7, 6],
        [0, 6, 1],
        [1, 6, 5],
        [1, 5, 2],
        [6, 7, 4],
        [6, 4, 5],
        [4, 7, 0],
        [4, 0, 3],
        [4, 3, 2],
        [4, 2, 5]]);

    super.setLocalPoints(localX, localY, localZ);
    super.updateSquare();
  }
}