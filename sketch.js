// Variable to move objects on the screen
let n = 1;

function setup() 
{
  createCanvas(400, 400);

  // Create squares
  r1 = new Rect(200, 200, 25, 50);
  r2 = new Rect(200, 200, 40, 30);
}

function draw() 
{
  // Set properties of project
  background(40);
  strokeWeight(5);
  stroke(230);

  n += 0.05;

  // Set properties of the first square
  s1.setScale(cos(n) / 2 + 3);
  s1.setPos(cos(n / 2) * 50 + 200, sin(n) * 50 + 200);
  s1.setRotation(n / 3);

  s1.updateSquare();
  s1.draw();

  // Set properties of the second square
  s2.setScale(sin(n) / 2 + 2.5);
  s2.setPos(-cos(n / 2) * 50 + 200, -sin(n) * 50 + 200);
  s2.setRotation(-n / 5);
  
  s2.updateSquare();
  s2.draw();
}

class Rect
{
  constructor(x, y, height, width)
  {
    // Coordinate of center
    this.pos = [x, y];

    // Coordinate of local points
    this.localX = [-width / 2, width / 2,
                   width / 2, -width / 2];
    this.localY = [-height / 2, -height / 2,
                    height / 2,  height / 2];

    // Scene coordinate of points
    this.pointX = [x + this.localX[0], x + this.localX[1],
                   x + this.localX[2], x + this.localX[3]];
    this.pointY = [y + this.localY[0], y + this.localY[1],
                   y + this.localY[2], y + this.localY[3]];

    this.scale = 1;
    this.dir = [1, 0];
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
    for (let i = 0; i < 4; i++)
    {
      this.pointX[i] = this.pos[0] + this.dir[0] * (this.localX[i] * this.scale) - this.dir[1] * (this.localY[i] * this.scale);
      this.pointY[i] = this.pos[1] + this.dir[0] * (this.localY[i] * this.scale) + this.dir[1] * (this.localX[i] * this.scale);
    }
  }
}