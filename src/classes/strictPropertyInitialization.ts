// https://www.typescriptlang.org/docs/handbook/2/classes.html#--strictpropertyinitialization

export class Point {
  // error either in `strict` mode or with enabled `strictPropertyInitialization` flag in tsconfig
  // @ts-expect-error
  x: number;
}
