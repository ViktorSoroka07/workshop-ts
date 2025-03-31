export class Person {
  public name: string;
  public age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  walk() {
    return "walk";
  }
}

export class Student extends Person {
  subjects: string[];

  constructor(name: string, age: number, subjects: string[]) {
    super(name, age);

    this.subjects = subjects;
  }

  // `noImplicitOverride` flag can be used to ensure that functions which override include `override` keyword
  // https://www.typescriptlang.org/tsconfig/#noImplicitOverride
  override walk() {
    return `student ${super.walk()}`;
  }
}

const student = new Student("john", 3, ["Mathematics"]);

console.log(student.walk()); // student walk
