// =============================================================================
// Conditional Types
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html

// Sometimes the type you want depends on the type you are given: "if it is an array, give me
// the element type, else keep the type unchanged". A conditional type is an if/else for types:
//   T extends U ? TypeIfTrue : TypeIfFalse
// `extends` here asks "is T assignable to U?"

export {};

// --- A basic conditional ---

type IsString<T> = T extends string ? 'yes' : 'no';

type LiteralCheck = IsString<'hello'>; // type: "yes"
type NumberCheck = IsString<42>; // type: "no"

// --- Distribution over a union ---

// When the checked type is a bare type parameter and you pass a union, TypeScript runs
// the conditional on each member separately and unions the results:
type ToArray<T> = T extends unknown ? T[] : never;

type Wrapped = ToArray<string | number>; // type: number[] | string[]

// ToArray<string | number>
//   |-- string -> string[]    (T extends unknown ? T[] : never)
//   |-- number -> number[]
//   '-- union of the results: number[] | string[]    (not (string | number)[])

// `T extends unknown` is always true; it is there only to trigger the distribution.
// To keep the union together, wrap both sides in a tuple, which stops it:
type ToArrayTogether<T> = [T] extends [unknown] ? T[] : never;

type WrappedTogether = ToArrayTogether<string | number>; // type: (string | number)[]

// ⚠️ Gotcha: `never` is the empty union, so there is nothing to distribute over and the
// result is `never`, not `never[]`:
type EmptyWrap = ToArray<never>; // type: never

// --- infer: capturing part of a type ---

// `infer` names a piece of the type being checked, so you can use it in the true branch.
// You describe a shape and let TypeScript fill in the hole. Element type of an array:
type ElementOf<T> = T extends (infer Element)[] ? Element : never;

type TagName = ElementOf<string[]>; // type: string
type OrderTotal = ElementOf<number[]>; // type: number

// The same idea on a function type -- capture what it returns. (This is the built-in
// ReturnType, see 07-unionAndFunctionUtilityTypes.ts.)
type ReturnOf<T> = T extends (...args: any[]) => infer Result ? Result : never;

function fetchUser(id: number) {
  return { id, name: 'Alice', role: 'admin' as const };
}

type FetchedUser = ReturnOf<typeof fetchUser>; // type: { id: number; name: string; role: "admin"; }

// And what a Promise resolves to; anything else passes through:
type Unwrap<T> = T extends Promise<infer Inner> ? Inner : T;

type ResolvedUser = Unwrap<Promise<{ id: number; name: string }>>; // type: { id: number; name: string; }
type NotAPromise = Unwrap<string>; // type: string

// --- Chaining conditionals ---

// Chained like if / else if / else. Mapping types to labels:
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends (...args: any[]) => any
        ? 'function'
        : 'object';

type StringName = TypeName<string>; // type: "string"
type NumberName = TypeName<42>; // type: "number"
type FunctionName = TypeName<() => void>; // type: "function"
type ObjectName = TypeName<{ id: number }>; // type: "object"

// --- Conditional types inside mapped types: filtering keys ---

// In 04-mappedTypes.ts, `as` renamed keys. Remapping a key to `never` drops it, and a
// conditional decides which keys get dropped.

interface Product {
  id: number;
  title: string;
  price: number;
}

// Filter by key name -- drop `id`:
type WithoutId<T> = {
  [K in keyof T as K extends 'id' ? never : K]: T[K];
};

type NewProduct = WithoutId<Product>; // type: { title: string; price: number; }

// Filter by value type -- keep data, drop methods:
class Order {
  id = 1;
  total = 99.99;
  cancel() {}
}

type WithoutMethods<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};

type OrderData = WithoutMethods<Order>; // type: { id: number; total: number; }

// 🎓 On your own: harder because the return type is a conditional that depends on the argument,
// so the compiler cannot check the function body against it.
// `first` in 01-genericFunctions.ts returns `T | undefined` even for `[10, 20, 30]`. A conditional
// return type can tell a non-empty tuple from a plain array. The `const` type parameter
// (03-constraints.ts) makes TypeScript read the literal as a tuple:
function firstOf<const Items extends readonly unknown[]>(
  items: Items
): Items extends readonly [infer Head, ...unknown[]]
  ? Head
  : Items[number] | undefined {
  return items[0] as any; // `as any`: TypeScript cannot check a value against an unresolved conditional
}

const fromTuple = firstOf([10, 20, 30]); // type: 10 -- a tuple, so the first element exists
const fromArray = firstOf([] as number[]); // type: number | undefined
