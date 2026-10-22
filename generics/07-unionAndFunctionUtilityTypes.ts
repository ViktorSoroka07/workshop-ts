// =============================================================================
// Built-in Utility Types for Unions and Functions
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers

// The object utilities in 05-objectUtilityTypes.ts are mapped types. The ones here are
// conditional types (06-conditionalTypes.ts): the union ones use distribution, the function
// ones use `infer`.

export {};

// --- Exclude and Extract: filter a union ---

// Distribution runs the check per member; returning `never` drops the member.
// Written out, Exclude is one line:
type RemoveFrom<Union, Removed> = Union extends Removed ? never : Union;

type Role = 'admin' | 'editor' | 'viewer' | 'guest';

type SignedInRole = RemoveFrom<Role, 'guest'>; // type: "admin" | "editor" | "viewer"

// The built-in Exclude<Union, Removed> is exactly that. Extract is the opposite: keep the matches.
type SignedIn = Exclude<Role, 'guest'>; // type: "admin" | "editor" | "viewer"
type TextInput = Extract<
  'text' | 'number' | 'email' | 'checkbox',
  'text' | 'email'
>; // type: "email" | "text"

// --- NonNullable: strip null and undefined ---

interface User {
  id: number;
  name: string;
}

type MaybeUser = User | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>; // type: User

// Its main use is a type guard (../types/11-narrowing.ts) that filters empty values out of a list:
function isPresent<T>(value: T): value is NonNullable<T> {
  return value != null;
}

const rawNames = ['Alice', null, 'Bob', undefined];
const names = rawNames.filter(isPresent); // type: string[]

console.log(names); // [ 'Alice', 'Bob' ]

// --- Parameters and ReturnType: read a function's signature ---

// These take the types from an existing function, which matters when you do not own it
// (a library) or do not want to write the signature twice. `typeof` turns the function
// value into a type (../types/14-typeofKeyofIndexedAccess.ts):
function createOrder(product: string, quantity: number, price: number) {
  return { product, quantity, total: quantity * price };
}

type OrderParams = Parameters<typeof createOrder>; // type: [product: string, quantity: number, price: number]
type OrderResult = ReturnType<typeof createOrder>; // type: { product: string; quantity: number; total: number; }

// A wrapper that takes the same arguments as the function it wraps, and stays in sync with it:
function logged(...args: OrderParams): OrderResult {
  console.log('creating order for', args[0]);

  return createOrder(...args);
}

console.log(logged('Keyboard', 2, 75).total); // creating order for Keyboard, then 150

// --- Awaited: what a Promise resolves to ---

async function fetchOrders(): Promise<{ id: number; total: number }[]> {
  return [{ id: 1, total: 99 }];
}

// ReturnType alone gives the Promise; Awaited unwraps it:
type OrdersPromise = ReturnType<typeof fetchOrders>; // type: Promise<{ id: number; total: number; }[]>
type Orders = Awaited<OrdersPromise>; // type: { id: number; total: number; }[]

// 🎓 On your own: harder because the type refers to itself, one level per Promise.
// Awaited unwraps nested Promises. Written out, it is a recursive conditional type:
type ResolvedOf<T> = T extends Promise<infer Inner> ? ResolvedOf<Inner> : T;

type Nested = ResolvedOf<Promise<Promise<string>>>; // type: string

// 🎓 On your own: harder because it combines a constructor type, a rest parameter and two
// utility types in one signature.
// ConstructorParameters and InstanceType do for classes what Parameters and ReturnType do for functions:
class Product {
  constructor(
    public name: string,
    public price: number
  ) {}
}

type ProductArgs = ConstructorParameters<typeof Product>; // type: [name: string, price: number]
type ProductInstance = InstanceType<typeof Product>; // type: Product

// A factory that builds any class and checks the arguments against its constructor.
// `new (...args: any[]) => any` is the type of "something you can call with new":
function createInstance<Ctor extends new (...args: any[]) => any>(
  ctor: Ctor,
  ...args: ConstructorParameters<Ctor>
): InstanceType<Ctor> {
  return new ctor(...args);
}

const keyboard = createInstance(Product, 'Keyboard', 75); // type: Product

// @ts-expect-error
createInstance(Product, 'Keyboard'); // Error: Expected 3 arguments, but got 2.
