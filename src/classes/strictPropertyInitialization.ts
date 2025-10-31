// https://www.typescriptlang.org/docs/handbook/2/classes.html#--strictpropertyinitialization

export class Point {
  // error either in `strict` mode or with enabled `strictPropertyInitialization` and `strictNullChecks` flags in tsconfig
  // @ts-expect-error
  x: number;
}

const point = new Point();

point.x = 1;
