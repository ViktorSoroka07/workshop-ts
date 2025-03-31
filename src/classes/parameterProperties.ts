// `PersonShorthand` has same behavior as `Person` bellow by leveraging Parameter Properties notation where access modifiers are defined in constructor
// https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties
export class PersonShorthand {
  constructor(
    private readonly name: string,
    private readonly age: number,
  ) {}

  toString(): string {
    return `${this.name} is ${this.age} years old`;
  }
}

export class Person {
  private readonly name: string;
  private readonly age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  toString(): string {
    return `${this.name} is ${this.age} years old`;
  }
}

console.log(new PersonShorthand("John", 20)); // John is 20 years old
console.log(new Person("John", 20).toString()); // John is 20 years old
