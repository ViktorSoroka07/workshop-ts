export {};

// Sometimes the type you want depends on what type you're given.
// For example: if it's an array, give me the element type; if not, keep it as-is.
// Conditional types let you express this: T extends U ? TrueType : FalseType

// --- Basic conditional ---

// Is this type a string? Return "yes" or "no" at the type level:
type IsString<T> = T extends string ? 'yes' : 'no';

type StringCheck1 = IsString<'hello'>; // "yes"
type StringCheck2 = IsString<42>; // "no"

// A more useful example — check if T is an array:
type IsArray<T> = T extends unknown[] ? 'array' : 'not array';

type ArrayCheck1 = IsArray<number[]>; // "array"
type ArrayCheck2 = IsArray<string>; // "not array"

// --- Distributive conditional types ---

// What happens when you pass a union like `string | number` to a conditional type?
// You might expect one result, but TS applies the conditional to each member
// separately and unions the results back together:
type ToArray<T> = T extends unknown ? T[] : never;

type Mixed = ToArray<string | number>;
// string[] | number[] — NOT (string | number)[]
// Each member of the union is wrapped separately.

// `T extends unknown` is always true — everything extends unknown, even `never`.
// It looks useless, but it's what triggers TS to distribute over each union member separately.

// If you DON'T want this behavior and want the union to stay together, wrap both sides in a tuple:
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

type MixedNonDist = ToArrayNonDist<string | number>;
// (string | number)[] — union stays together

// --- infer: extracting types from structures ---

// `infer` lets you "capture" a part of a type inside a conditional.
// Instead of specifying the type, you let TS figure it out for you.

// Extract the element type from an array:
type ElementOf<T> = T extends (infer E)[] ? E : never;

type ProductNames = ElementOf<string[]>; // string
type OrderAmounts = ElementOf<number[]>; // number

// Same idea applied to functions — extract what a function returns:
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function fetchUser(value: string) {
  return { id: 1, value, name: 'Alice', role: 'admin' as const };
}

type FetchedUser = MyReturnType<typeof fetchUser>;
// { id: number; name: string; role: "admin" }

// Works with Promises too — extract what a Promise resolves to:
type Unwrap<T> = T extends Promise<infer Inner> ? Inner : T;

type ResolvedUser = Unwrap<Promise<{ id: number; name: string }>>; // { id: number; name: string }
type NotAPromise = Unwrap<string>; // string — passthrough

// --- Nested conditionals ---

// You can chain conditionals like if/else if/else.
// Useful for mapping types to string labels or different behaviors:
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends Function
        ? 'function'
        : 'object';

type A = TypeName<string>; // "string"
type B = TypeName<42>; // "number"
type C = TypeName<() => void>; // "function"
type D = TypeName<{ id: number }>; // "object"

// --- Conditional return type in a function ---

// In 01-basics.ts first() always returns T | undefined, even for [10, 20, 30].
// A conditional return type can be smarter — check if the array is a non-empty tuple
// and narrow the return type accordingly. One signature, no overloads needed.
// The `const` modifier (TS 5.0+) makes TS infer a tuple instead of a plain array,
// so the caller doesn't need to write `as const`:
function first<const T extends readonly any[]>(
  arr: T
): T extends readonly [infer F, ...any[]] ? F : T[number] | undefined {
  return arr[0] as any; // `as any` needed — TS can't verify conditionals inside the body
}

const fromTuple = first([10, 20, 30]); // hover: 10 — TS sees a tuple, not number[]
const fromDynamic = first([] as number[]); // hover: number | undefined

// --- Combining conditionals with mapped types ---

// In 04-mappedTypes.ts we used `as` to rename keys. You can also use `as` with
// a conditional to filter keys out — remapping to `never` removes the key entirely.

// Filter by key name — remove 'id' from any type:
interface Product {
  id: number;
  title: string;
  price: number;
}

type WithoutId<T> = {
  [K in keyof T as K extends 'id' ? never : K]: T[K];
};

type ProductWithoutId = WithoutId<Product>;
// { title: string; price: number }

// Filter by value type — remove all methods, keeping only data properties:
class Order {
  id = 1;
  total = 99.99;
  cancel() {}
}

type WithoutMethods<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

type OrderData = WithoutMethods<Order>;
// { id: number; total: number } — cancel is gone
