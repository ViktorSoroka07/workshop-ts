import { ValuesType } from 'utility-types';

// Generic interfaces

interface PrevNext<T, U> {
  previous: T;
  next: U;
}

const pair: PrevNext<string, number> = { previous: 'Hello', next: 42 };

console.log(pair);

// Generic classes

class Box<T> {
  private readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const numberBox = new Box(10);
console.log(numberBox.getValue()); // 10

const stringBox = new Box('Hello');
console.log(stringBox.getValue()); // "Hello"

// Typescript generics for React developers article with real world example
// https://www.developerway.com/posts/typescript-generics-for-react-developers

// [Conditional types] (https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

// Conditional types are a powerful feature in TypeScript that allow you to express types that depend on other types. They follow the form:

// T extends U ? X : Y
// If T can be assigned to U, then the type resolves to X; otherwise, it resolves to Y.

type IsString<T> = T extends string ? 'Yes' : 'No';
type Test1 = IsString<string>; // "Yes"
type Test2 = IsString<number>; // "No"

type IsArray<T> = T extends unknown[] ? 'Array' : 'Not Array';

type Test3 = IsArray<number[]>; // "Array"
type Test4 = IsArray<string>; // "Not Array"

type WrapInArray<T> = T extends unknown[] ? T : T[];

type Test5 = WrapInArray<string>; // string[]
type Test6 = WrapInArray<string[]>; // string[]

// Infer keyword in conditional type

// The infer keyword can be used inside conditional types to infer a type within a given structure and use it in the true branch of the conditional type.

type ArrayElementType<T> = T extends (infer U)[] ? U : never;

type StringArrayElement = ArrayElementType<string[]>;

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Test7 = ReturnType<() => string>; // string
type Test8 = ReturnType<(x: number) => boolean>; // boolean
type Testtt = ReturnType<boolean>; // boolean

type IsStringOrNumber<T> = T extends string ? 'String' : T extends number ? 'Number' : 'Other';

type Test9 = IsStringOrNumber<string>; // "String"
type Test10 = IsStringOrNumber<number>; // "Number"
type Test11 = IsStringOrNumber<boolean>; // "Other"

// Merge function with generics

function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'John' }, { age: 30 });

console.log(merged); // { name: 'John', age: 30 }

// =============================================================================
// [Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
// =============================================================================

/*
  Mapped types let you create new types by transforming every property of an
  existing type. Think of them as a "for loop" over property keys:

    { [K in Keys]: NewValueType }

  - K        -- loop variable (each key in turn)
  - Keys     -- the union of keys to iterate over (often `keyof T`)
  - NewValueType -- the type to assign to each property (can use K and T[K])

  This is the foundation behind built-in utility types like Partial, Required,
  Readonly, Record, Pick, and Omit -- they're all mapped types under the hood.
*/

// -----------------------------------------------------------------------------
// Basic syntax: iterating over keyof T
// -----------------------------------------------------------------------------

// CustomPick recreates the built-in `Pick<T, K>`. It copies only the selected
// keys from T into a new type:
type CustomPick<T extends Record<string, any>, K extends keyof T> = {
  [P in K]: T[P];
};

interface Person {
  name: string;
  age: number;
  email: string;
}

type PersonNameAndEmail = CustomPick<Person, 'name' | 'email'>;
// { name: string; email: string }

// -----------------------------------------------------------------------------
// Iterating over a custom union (not just keyof)
// -----------------------------------------------------------------------------

// The keys don't have to come from an existing type. You can iterate over any
// string literal union to build a type from scratch:
type EventHandlers = {
  [E in 'click' | 'hover' | 'focus']: (event: Event) => void;
};

// Result: { click: (event: Event) => void; hover: ...; focus: ... }
const handlers: EventHandlers = {
  click: (e) => console.log('clicked', e),
  hover: (e) => console.log('hovered', e),
  focus: (e) => console.log('focused', e),
};

// -----------------------------------------------------------------------------
// Adding modifiers: readonly and optional (?)
// -----------------------------------------------------------------------------

// ReadonlyProps recreates `Readonly<T>` -- adds `readonly` to every property:
type ReadonlyProps<T> = {
  readonly [K in keyof T]: T[K];
};

const readonlyPerson: ReadonlyProps<Person> = { name: 'Alice', age: 30, email: 'a@b.com' };
// @ts-expect-error
readonlyPerson.name = 'Bob'; // Error: Cannot assign to 'name' because it is a read-only property

// OptionalProps recreates `Partial<T>` -- adds `?` to every property:
type OptionalProps<T> = {
  [K in keyof T]?: T[K];
};

const partial: OptionalProps<Person> = { name: 'Alice' }; // age and email can be omitted

// -----------------------------------------------------------------------------
// Removing modifiers with `-`
// -----------------------------------------------------------------------------

// The `-` prefix removes a modifier. `-?` removes optionality (like `Required<T>`):
type CustomRequired<T> = {
  [K in keyof T]-?: T[K];
};

type UserFull = CustomRequired<{
  id: string;
  name?: string;
  age?: number;
}>;
// { id: string; name: string; age: number } -- no optional properties

// `-readonly` removes the readonly modifier, making properties mutable again:
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type FrozenConfig = {
  readonly host: string;
  readonly port: number;
};

const config: Mutable<FrozenConfig> = { host: 'localhost', port: 3000 };
config.host = '0.0.0.0'; // OK -- readonly was stripped

// -----------------------------------------------------------------------------
// Transforming values: wrapping in Promise
// -----------------------------------------------------------------------------

// Mapped types shine when you need to systematically transform property types.
// Async<T> wraps every field in a Promise:
type Async<T> = {
  [K in keyof T]: Promise<T[K]>;
};

type UserData = { name: string; age: number };
type AsyncUserData = Async<UserData>;
// { name: Promise<string>; age: Promise<number> }

const asyncUser: AsyncUserData = {
  name: Promise.resolve('Alice'),
  age: Promise.resolve(30),
};

// -----------------------------------------------------------------------------
// Conditional value per key
// -----------------------------------------------------------------------------

// You can combine mapped types with conditional expressions to treat keys
// differently:
type FilteredOptional<T> = {
  [K in keyof T]: K extends 'age' ? T[K] : T[K] | undefined;
};

interface Employee {
  name: string;
  age: number;
  department: string;
}

const employee: FilteredOptional<Employee> = {
  name: 'Alice',
  age: 30,
  department: undefined, // department is now allowed to be undefined
};

console.log(employee);

// -----------------------------------------------------------------------------
// Key remapping with `as`
// -----------------------------------------------------------------------------

// Since TS 4.1 you can remap keys inside a mapped type using `as`.
// This lets you rename, filter, or generate new keys.

// --- Generating getter names ---
// Capitalize each key and prefix it with "get" to create accessor method types:
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; getEmail: () => string }

const personGetters: PersonGetters = {
  getName: () => 'Alice',
  getAge: () => 30,
  getEmail: () => 'alice@example.com',
};

// --- Filtering keys with `as` + `never` ---
// When the `as` clause resolves to `never`, the key is dropped entirely.
// This is how you exclude specific properties:
type RemoveProperty<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

/*
  Breaking it down:
  - [P in keyof T]        -- iterate over every key P in T
  - as P extends K         -- if P is one of the keys to remove...
      ? never              -- ...drop it (never removes the key)
      : P                  -- ...otherwise keep it
  - T[P]                  -- preserve the original value type
*/

type PersonWithoutEmail = RemoveProperty<Person, 'email'>;

const person: PersonWithoutEmail = {
  name: 'Alice',
  age: 30,
};

// @ts-expect-error
const personBad: PersonWithoutEmail = { name: 'Alice', age: 30, email: 'a@b.com' };
// Error: Object literal may only specify known properties

// -----------------------------------------------------------------------------
// Practical example: FormState
// -----------------------------------------------------------------------------

// A common real-world pattern -- wrapping each field of a form model with
// metadata for validation state:
type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
  };
};

interface LoginForm {
  username: string;
  password: string;
}

const loginState: FormState<LoginForm> = {
  username: { value: '', error: null, touched: false },
  password: { value: '', error: 'Required', touched: true },
};

console.log(loginState.username.error); // null

// -----------------------------------------------------------------------------
// Built-in mapped utility types
// -----------------------------------------------------------------------------

/*
  TypeScript ships several mapped types you should know. All are implemented
  with the same `{ [K in ...]: ... }` pattern shown above:

  - Partial<T>   -- makes every property optional        (adds `?`)
  - Required<T>  -- makes every property required         (removes `?`)
  - Readonly<T>  -- makes every property readonly         (adds `readonly`)
  - Record<K, V> -- creates a type with keys K and value type V
  - Pick<T, K>   -- keeps only the listed keys
  - Omit<T, K>   -- removes the listed keys
*/

// Record<K, V> -- build an object type from a key union and a value type:
type Role = 'admin' | 'editor' | 'viewer';
type RolePermissions = Record<Role, string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
};

// Pick<T, K> -- select a subset of properties:
type ContactInfo = Pick<Person, 'name' | 'email'>;
// { name: string; email: string }

const contact: ContactInfo = { name: 'Alice', email: 'alice@example.com' };

// Omit<T, K> -- remove specific properties (inverse of Pick):
type PersonPublic = Omit<Person, 'email'>;
// { name: string; age: number }

const publicProfile: PersonPublic = { name: 'Alice', age: 30 };

// Practice to understand generics even more
// https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md

// utility-types (https://github.com/piotrwitek/utility-types)

type PropsValues = ValuesType<{ name: string; age: number; visible: boolean }>; // string | number | boolean

// [@total-typescript/ts-reset](https://www.totaltypescript.com/ts-reset)

const arr = [1, 2, null, undefined];

const data = arr.filter(Boolean); // with @total-typescript/ts-reset enabled - number[], without (number | null | undefined)[]
