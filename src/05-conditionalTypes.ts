export {};

// Conditional types are type-level if/else: T extends U ? TrueType : FalseType

// --- Basic conditional ---

// Flatten an array type to its element, or leave non-arrays alone:
type Flatten<T> = T extends Array<infer Item> ? Item : T;

type OrderIds = Flatten<number[]>; // number
type SingleId = Flatten<string>; // string — not an array, returned as-is

// --- Distributive conditional types ---

// When T is a union, the conditional distributes over each member individually:
type ToArray<T> = T extends unknown ? T[] : never;

type Mixed = ToArray<string | number>;
// string[] | number[] — NOT (string | number)[]
// Each member of the union is wrapped separately.

// To prevent distribution, wrap both sides in a tuple:
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

type MixedNonDist = ToArrayNonDist<string | number>;
// (string | number)[] — union stays together

// --- infer: extracting types from structures ---

// Extract the element type from an array:
type ElementOf<T> = T extends (infer E)[] ? E : never;

type ProductNames = ElementOf<string[]>; // string
type OrderAmounts = ElementOf<number[]>; // number

// Extract the return type from a function (recreating ReturnType<T>):
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function fetchUser() {
  return { id: 1, name: 'Alice', role: 'admin' as const };
}

type FetchedUser = MyReturnType<typeof fetchUser>;
// { id: number; name: string; role: "admin" }

// Extract the resolved type from a Promise:
type Unwrap<T> = T extends Promise<infer Inner> ? Inner : T;

type ResolvedUser = Unwrap<Promise<{ id: number; name: string }>>; // { id: number; name: string }
type NotAPromise = Unwrap<string>; // string — passthrough

// --- Nested conditionals ---

// Classify a type into a category:
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

// --- Practical: extracting event payload ---

interface AppEvents {
  login: { userId: number; timestamp: Date };
  logout: { userId: number };
  purchase: { orderId: number; total: number };
}

// Given an event name, extract its payload type:
type EventPayload<K extends keyof AppEvents> = AppEvents[K];

type LoginPayload = EventPayload<'login'>; // { userId: number; timestamp: Date }
type PurchasePayload = EventPayload<'purchase'>; // { orderId: number; total: number }
