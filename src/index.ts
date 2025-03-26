import { ValuesType } from "utility-types";
import { identity } from "lodash";

// Generic functions

function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

console.log(getFirstElement([1, 2, 3])); // 1
console.log(getFirstElement(["apple", "banana", "cherry"])); // "apple"

function customIdentity<T>(value: T): T {
  return value;
}

console.log(customIdentity(42)); // 42
console.log(customIdentity("Hello, world!")); // "Hello, world!"

// Generic interfaces

interface PrevNext<T, U> {
  previous: T;
  next: U;
}

const pair: PrevNext<string, number> = { previous: "Hello", next: 42 };
console.log(pair);

// Generic classes

class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const numberBox = new Box(10);
console.log(numberBox.getValue()); // 10

const stringBox = new Box("Hello");
console.log(stringBox.getValue()); // "Hello"

// Typescript generics for React developers article with real world example
// https://www.developerway.com/posts/typescript-generics-for-react-developers

// [Conditional types] (https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

// T extends U ? X : Y

type IsString<T> = T extends string ? "Yes" : "No";
type Test1 = IsString<string>; // "Yes"
type Test2 = IsString<number>; // "No"

type IsArray<T> = T extends unknown[] ? "Array" : "Not Array";

type Test3 = IsArray<number[]>; // "Array"
type Test4 = IsArray<string>; // "Not Array"

type WrapInArray<T> = T extends any[] ? T : T[];

type Test5 = WrapInArray<string>; // string[]
type Test6 = WrapInArray<string[]>; // string[]

// The infer keyword can be used inside conditional types to infer a type within a given structure
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ArrayElementType<T> = T extends (infer U)[] ? U : never;

type StringArrayElement = ArrayElementType<string[]>;

type Test7 = ReturnType<() => string>; // string
type Test8 = ReturnType<(x: number) => boolean>; // boolean

type IsStringOrNumber<T> = T extends string
  ? "String"
  : T extends number
    ? "Number"
    : "Other";

type Test9 = IsStringOrNumber<string>; // "String"
type Test10 = IsStringOrNumber<number>; // "Number"
type Test11 = IsStringOrNumber<boolean>; // "Other"

// Merge function with generics

function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "John" }, { age: 30 });

console.log(merged); // { name: 'John', age: 30 }

// [Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/////////////

type ReadonlyProps<T> = {
  readonly [K in keyof T]: T[K];
};

/////////////

type OptionalProps<T> = {
  [K in keyof T]?: T[K];
};

/////////////

type Concrete<T> = {
  [K in keyof T]-?: T[K];
};

type UserFull = Concrete<{
  id: string;
  name?: string;
  age?: number;
}>;

/////////////

type FilteredOptional<T> = {
  [K in keyof T]: K extends "age" ? T[K] : T[K] | undefined;
};

interface Employee {
  name: string;
  age: number;
  department: string;
}

const employee: FilteredOptional<Employee> = {
  name: "Alice",
  age: 30,
  department: undefined, // department is now allowed to be undefined
};

console.log(employee);

//////////////

type RemoveProperty<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

/*
- [P in keyof T]: This iterates over each key P in the type T
- as P extends K ? never : P: This is the key part of the implementation. We use the `as` keyword to conditionally transform the key:
  - If P extends K (meaning the key P is the one we want to remove), it is replaced with never. This effectively removes that property from the resulting type.
  - Otherwise, we leave the key P as it is.

- T[P]: This gets the type associated with the property P in the original type T.
 */

interface Person {
  name: string;
  age: number;
  email: string;
}

type PersonWithoutEmail = RemoveProperty<Person, "email">;

const person: PersonWithoutEmail = {
  name: "Alice",
  age: 30,
  // email: "alice@example.com", // Error: Property 'email' is not allowed.
};

// Practice to understand generics even more
// https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md

// utility-types (https://github.com/piotrwitek/utility-types)

type PropsValues = ValuesType<{ name: string; age: number; visible: boolean }>; // string | number | boolean

// [@total-typescript/ts-reset](https://www.totaltypescript.com/ts-reset)

const arr = [1, 2, null, undefined];

const data = arr.filter(Boolean); // with @total-typescript/ts-reset enabled - number[], without (number | null | undefined)[]
