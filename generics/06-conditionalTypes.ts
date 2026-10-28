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

// To drop one role from a union of roles, the conditional has to decide for each member
// separately. When the checked type is a bare type parameter and you pass a union, TypeScript
// does exactly that: it runs the conditional on each member and unions the results.
// Returning `never` drops a member, because `never` is the empty union:
type Role = 'admin' | 'editor' | 'viewer' | 'guest';

type WithoutGuest<T> = T extends 'guest' ? never : T;

type SignedInRole = WithoutGuest<Role>; // type: "admin" | "editor" | "viewer"

// WithoutGuest<Role>
//   |-- 'admin'  -> 'admin'
//   |-- 'editor' -> 'editor'
//   |-- 'viewer' -> 'viewer'
//   |-- 'guest'  -> never    (dropped)
//   '-- union of the results: 'admin' | 'editor' | 'viewer'

// Wrap both sides in a tuple and the distribution stops: the union is checked as a whole.
// It is not assignable to 'guest', so nothing is dropped:
type WithoutGuestTogether<T> = [T] extends ['guest'] ? never : T;

type StillAllRoles = WithoutGuestTogether<Role>; // type: "admin" | "guest" | "editor" | "viewer" -- all four, nothing dropped

// This is how the built-in Exclude works (07-unionAndFunctionUtilityTypes.ts).

// --- infer: capturing part of a type ---

// `infer` names a piece of the type being checked, so you can use it in the true branch.
// You describe a shape and let TypeScript fill in the hole. Element type of an array (for this
// case `T[number]` is the shorter way; `infer` is for shapes that have no such shortcut):
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

// And what a Promise resolves to; anything else passes through. This is a one-level version
// of the built-in Awaited, which also unwraps nested Promises (07-unionAndFunctionUtilityTypes.ts):
type Unwrap<T> = T extends Promise<infer Inner> ? Inner : T;

type ResolvedUser = Unwrap<Promise<{ id: number; name: string }>>; // type: { id: number; name: string; }
type NotAPromise = Unwrap<string>; // type: string

// --- Chaining conditionals ---

// Chained like if / else if / else. In 04-mappedTypes.ts, `FormState` wrapped every field of a
// form; here a chain picks the `<input type>` each field needs from its TypeScript type:
type InputType<T> = T extends string
  ? 'text'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'checkbox'
      : T extends Date
        ? 'date'
        : never;

type EmailInput = InputType<string>; // type: "text"
type AgeInput = InputType<42>; // type: "number"
type BirthdayInput = InputType<Date>; // type: "date"
type NoInput = InputType<string[]>; // type: never -- no single input holds a list

// Applied to every field through a mapped type (04-mappedTypes.ts), the form's input types
// are derived from the form, and a wrong one is caught:
interface SignupForm {
  email: string;
  age: number;
  birthday: Date;
  newsletter: boolean;
}

type InputTypes<T> = {
  [K in keyof T]: InputType<T[K]>;
};

const signupInputs: InputTypes<SignupForm> = {
  email: 'text',
  // @ts-expect-error
  age: 'text', // Error: Type '"text"' is not assignable to type '"number"'.
  birthday: 'date',
  newsletter: 'checkbox',
};

console.log(signupInputs.age); // text -- the rejected value still runs; only the compiler objected

// --- Conditional types in the key position: filtering keys ---

// Above, the conditional decided each property's type. It can decide the key instead:
// in 04-mappedTypes.ts, `as` renamed keys, and remapping a key to `never` drops it, so a
// conditional in the `as` clause decides which keys get dropped.

interface Product {
  id: number;
  title: string;
  price: number;
}

// Filter by key name -- drop `id`. For fixed names the built-in Omit does this
// (05-objectUtilityTypes.ts); the conditional form is for choosing keys by a rule:
type WithoutId<T> = {
  [K in keyof T as K extends 'id' ? never : K]: T[K];
};

type NewProduct = WithoutId<Product>; // type: { title: string; price: number; }

// Filter by value type -- keep data, drop methods. Omit cannot do this: it takes names, not types:
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
