export class Point {
  private readonly x: number;
  private readonly y: number;

  // Constructor overloads
  constructor(x: number, y: number);
  constructor(xy: string);
  constructor(x: string | number, y: number = 0) {
    if (typeof x === "string") {
      // process `x,y` string format of point
      const coords = x.split(",").map(Number);

      this.x = coords[0];
      this.y = coords[1];
    } else {
      this.x = x;
      this.y = y;
    }

    console.log(this.x, this.y);
  }
}

new Point("5,10"); // 5 10
new Point(5, 10); // 5 10
