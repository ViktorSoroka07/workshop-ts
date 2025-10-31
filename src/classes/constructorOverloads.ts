export class Point {
  private readonly x: number;
  private readonly y: number;

  // Constructor overloads
  constructor(x: number, y: number);
  constructor(xy: string);
  constructor(x: string | number, y: number = 0) {
    if (typeof x === 'string') {
      // process `x,y` string format of point
      const coords = x.split(',').map(Number);

      this.x = coords[0];
      this.y = coords[1];
    } else {
      this.x = x;
      this.y = y;
    }

    console.log(this.x, this.y);
  }

  scale(value: number) {
    // @ts-expect-error
    this.x *= value; // Error: Cannot assign to 'x' because it is a read-only property.
    // @ts-expect-error
    this.y *= value; // Error: Cannot assign to 'y' because it is a read-only property.
  }
}

new Point('5,10'); // 5 10
new Point(5, 10); // 5 10

/*
Java version with constructor overloading:

public class Point {
    private final double x;
    private final double y;

    // Constructor overload 1: accepts two numbers
    public Point(double x, double y) {
        this.x = x;
        this.y = y;

        System.out.println(this.x + " " + this.y);
    }

    // Constructor overload 2: accepts a string
    public Point(String xy) {
        String[] coords = xy.split(",");
        this.x = Double.parseDouble(coords[0]);
        this.y = Double.parseDouble(coords[1]);

        System.out.println(this.x + " " + this.y);
    }

    public static void main(String[] args) {
        new Point("5,10"); // 5.0 10.0
        new Point(5, 10);  // 5.0 10.0
    }
}
*/
