// https://www.typescriptlang.org/tsconfig/#noImplicitThis

class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getAreaFunction() {
    return function () {
      // error because of lost context (this check is done in `strict` mode or by enabling `noImplicitThis` flag)
      // @ts-expect-error
      return this.width * this.height;
    };
  }
}

const rectangle = new Rectangle(3, 4);

rectangle.getAreaFunction()(); // TypeError: Cannot read properties of undefined (reading 'width')
