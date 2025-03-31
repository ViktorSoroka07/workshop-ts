// Primitive Types in TypeScript
/*
  number: Represents both integer and floating-point numbers.
  string: Represents a sequence of characters.
  boolean: Represents true or false.
  null: Represents the absence of a value.
  undefined: Represents an uninitialized value.
  symbol: Represents a unique and immutable identifier.
  bigint: Represents large integers.
*/

let num: number = 42;
let str: string = "Hello, TypeScript!";
let isActive: boolean = true;
let empty: null = null;
let notDefined: undefined = undefined;

// object
// let obj: object = { name: "Alice", age: 30 };  // Object is allowed
// obj = [1, 2, 3];  // Arrays are allowed
// obj = function() {};  // Functions are allowed
// obj = "hello";  // Error: "hello" is a string, which is a primitive

// Arrays, Readonly Arrays, and Tuples

// Array
let numbers: number[] = [1, 2, 3, 4];

// Readonly Array
let names: readonly string[] = ["Alice", "Bob"];

// Tuple
// let person: [string, number] = ["Alice", 30];
// let person: [string, number, boolean?] = ["Alice", 30];
let person: [string, ...number[], boolean] = ["Alice", 30, 30, 30, true];
let data: (string | number)[] = [30, "2", 1, 2, "3"];

const getName = (): [firstName: string, lastName: string] => ["John", "Smith"];

// Union Type

// let value: number | string;
//
// value = 42;     // Valid
// value = "hello"; // Valid
// value = true;    // Error: Type 'boolean' is not assignable to type 'number | string'

// Union Type and intersection type for objects

type Car = { brand: string; wheels: number };
type Boat = { brand: string; sails: number };

type Vehicle = Car | Boat;
// type Vehicle = Car & Boat;

let carBrand: Car["brand"];

let vehicle1: Vehicle = { brand: "Toyota", wheels: 4 };
let vehicle2: Vehicle = { brand: "Yamaha", sails: 2 };
let vehicle3: Vehicle = { brand: "Tesla", wheels: 4, sails: 1 };

// if (vehicle3.hasOwnProperty("wheels")) {
//   vehicle3.wheels
// }

// if ('sails' in vehicle3) {
//   vehicle3.sails
// }

// Literal Types

let color: "red" | "green" | "blue"; // Literal types
color = "red"; // Valid

// @ts-expect-error
color = "yellow";

// const sortArray: 1 | 0 | -1 = () => {}
// const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => `h${level}`;

let someNumber1 = 10;
const someNumber2 = 20;

// any vs unknown vs never

// any: no type checking
let anything: any = "Hello";
anything = 42; // No error

// unknown: needs type checking before usage
let unknownValue: unknown = "Hello";

if (typeof unknownValue === "string") {
  console.log(unknownValue.length); // Safe, because we know it's a string
}

let a: never;
// @ts-expect-error
a = 42; // Error: Type '42' is not assignable to type 'never'

// never: function that never returns a value
function throwError(message: string): boolean | never {
  if (message === "2") {
    return true;
  }

  throw new Error(message);
}

// Infinite loop:
function infiniteLoop(): never {
  while (true) {}
}

type Animal = "dog" | "cat" | "fish";

function temp() {
  return "dog";

  console.log("a");
}

function getSound(animal: Animal): string {
  switch (animal) {
    case "dog":
      return "Woof";
    case "cat":
      return "Meow";
    case "fish":
      return "Blub";
    default:
      // This will throw a compile-time error if not all cases are handled
      // The 'never' type ensures that all possibilities of Animal are checked
      const _exhaustiveCheck: never = animal;
      return _exhaustiveCheck; // This will never be reached if the Animal type is exhaustive
  }
}

// Enums

// Numeric Enums

enum Direction1 {
  Up,
  Down,
  Left,
  Right,
}

console.log(Direction1.Up); // Output: 1
console.log(Direction1.Left); // Output: 3

// Custom Numeric Values

enum Status {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
}

console.log(Status.Pending); // Output: 1

// String Enums

enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}

console.log(UserRole.Admin); // Output: "ADMIN"
console.log(UserRole.User); // Output: "USER"

// Heterogeneous Enums

enum Choice {
  No = 0,
  Yes = "YES",
}

console.log(Choice.No); // Output: 0
console.log(Choice.Yes); // Output: "YES"

// Enum Reverse Mappings (Numeric Enums)

enum Direction2 {
  Up = 1,
  Down,
  Left,
  Right,
}

console.log(Direction2[1]); // Output: "Up"
console.log(Direction2[2]); // Output: "Down"

// Const Enums

const enum Direction3 {
  Up = 1,
  Down,
  Left,
  Right,
}

let dir = Direction3.Up;
console.log(dir); // Output: 1

// type narrowing

function printLength(input: string | number) {
  if (typeof input === "string") {
    console.log(input.length); // `input` is narrowed to `string`

    return;
  }

  console.log(input.toFixed(2)); // `input` is narrowed to `number`
}

printLength("Hello"); // Output: 5
printLength(42); // Output: 42.00

// Index access type

type DataOptions = {
  id: string;
  // id: `data-${string}`;
  [key: string]: string | number;
};

type DataOptions3 = Record<"id" | string, string | number>;

const dataOptions: DataOptions3 = {
  id: "data-id",
  search: "John",
  search1: 2,
};

const people = [
  { name: "John", id: 1, id1: 2 },
  { name: "Doe", id: 2, id1: 2 },
];

type PersonDto = {
  name: string;
  id: number;
};

type PersonData = Record<
  "name" | "id" | "id1",
  { name: "John"; id: 1; id1: 2 }
>;

// typeof

type Person = (typeof people)[number];

// keyof

type PersonKey = keyof Person;
type PersonValue = Person[PersonKey];

const getPersonValueByKey = (person: Person, key: PersonKey) => {
  return person[key];
};

getPersonValueByKey(people[0], "name");
getPersonValueByKey(people[1], "id");
// @ts-expect-error
getPersonValueByKey(people[1], "unknown");

// type DataOptions3 = {
//   [key: number]: string;
// }

// type DataOptionsIndex = keyof DataOptions3;
