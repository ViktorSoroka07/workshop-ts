// =============================================================================
// Generic Functions
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/generics.html

// A type parameter (`<T>`) is a placeholder for a type. The function is written once and
// the caller decides what `T` is -- usually by just passing a value, because TypeScript
// infers it. That keeps full type safety without writing the function once per type.
//
// This folder is compiled with `strict` on (see its tsconfig.json), since generic code is
// where the strict checks matter most.

export {};

// --- The problem: one function, many types ---

// Without generics you either duplicate the function per type...
function identityNumber(value: number): number {
  return value;
}

function identityString(value: string): string {
  return value;
}

// ...or use `any`, which compiles for everything and checks nothing (see ../types/08-anyUnknownNever.ts):
function identityAny(value: any): any {
  return value;
}

const maybeNumber = identityAny(42); // type: any

// ⚠️ Gotcha: the result is `any`, so the compiler checks nothing on it:
function shout() {
  return maybeNumber.toUpperCase(); // OK -- compiles; calling shout() throws "maybeNumber.toUpperCase is not a function"
}

// --- A type parameter solves both ---

// `T` links the parameter to the return type: whatever goes in is what comes out.
// ✅ Best practice: `T` ("type") is the convention for a lone parameter; with several, use
// short descriptive names (`Item`, `Result`) or the usual letters: `K` key, `V` value, `E` error.
function identity<T>(value: T): T {
  return value;
}

const num = identity(42); // type: 42 -- T is inferred from the argument
const str = identity<string>('hello'); // type: string -- or spelled out as a type argument

// 🧪 Try it: hover `num`. The literal type 42 is kept, not widened to `number`.

// --- Inference flows from one argument into the others ---

// `T[]` means "an array of T", so passing an array tells TypeScript what `T` is:
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const firstScore = first([10, 20, 30]); // type: number | undefined
const firstName = first(['Alice', 'Bob']); // type: string | undefined

// `undefined` is in the return type because an array can be empty at runtime.

// With two type parameters, inference from the first array types the callback parameter:
function mapItems<Item, Result>(
  items: Item[],
  transform: (item: Item) => Result
): Result[] {
  return items.map(transform);
}

const emailLengths = mapItems(
  ['alice@example.com', 'bob@example.com'],
  (email) => email.length
); // type: number[]

console.log(emailLengths); // [ 17, 15 ]

// --- When inference has two candidates ---

// Both parameters use `T`, so both arguments must agree on one type:
function pairOf<T>(left: T, right: T): [T, T] {
  return [left, right];
}

const scores = pairOf(1, 2); // type: [number, number]

// @ts-expect-error
pairOf('Alice', 42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'.

// If mixing is intended, say so with an explicit type argument:
const mixed = pairOf<string | number>('Alice', 42); // type: [string | number, string | number]

// --- When there is nothing to infer from ---

// `T` appears only in the return type, so there is no argument to infer it from:
function emptyList<T>(): T[] {
  return [];
}

const unknownList = emptyList(); // type: unknown[] -- T falls back to `unknown`
const names = emptyList<string>(); // type: string[]

// ✅ Best practice: write the type argument only where inference cannot work (as here) or
// picks a wider type than you want; elsewhere leave it out, as in `identity(42)`.

// --- A type parameter must earn its place ---

// ⚠️ Gotcha: `T` here appears once, so it ties nothing to anything:
function logValue<T>(value: T): void {
  console.log(value);
}

// ✅ Best practice: use it at least twice (an input and an output, or two inputs); a lone use
// is just `unknown` in disguise:
function logAnything(value: unknown): void {
  console.log(value);
}
