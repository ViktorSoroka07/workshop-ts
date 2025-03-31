// https://www.typescriptlang.org/docs/handbook/2/classes.html#cross-instance-private-access

export class Point {
  constructor(
    private x: number,
    private y: number,
  ) {}

  isEqual(other: Point) {
    // No error despite the fact that `x` and `y` are private
    return other.x === this.x && other.y === this.y;
  }
}

console.log(new Point(1, 1).isEqual(new Point(1, 1))); // true
console.log(new Point(1, 1).isEqual(new Point(1, 2))); // false
