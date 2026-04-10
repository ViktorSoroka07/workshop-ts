export {};

// --- extends: limiting what T can be ---

// Say you want a function that merges two objects. A bare <T> accepts
// anything — strings, numbers, null — which doesn't make sense for merging.
// `extends object` tells TS to reject primitives at compile time.
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'Alice' }, { role: 'admin' }); // OK
// @ts-expect-error — primitives are not objects
merge('hello', 42);
// @ts-expect-error — despite `typeof null === "object"` in JS, TS's `object` type
// excludes null (and undefined). It means "any non-primitive value".
merge(null, { role: 'admin' });

// --- keyof + indexed access ---

// Imagine you want a function that gets a property from an object by key.
// Simple approach — accept any string as key:
function unsafePluck(obj: Record<string, unknown>, key: string) {
  return obj[key]; // return type: unknown
}

const account = { id: 1, name: 'Alice', isAdmin: true };
const name1 = unsafePluck(account, 'name'); // hover: unknown — even for a valid key
const oops = unsafePluck(account, 'naem'); // typo compiles fine — returns undefined at runtime

// Two problems: TS doesn't know which keys are valid, and the return type is always unknown.
// keyof + indexed access fix both:

// By constraining K to `keyof T`, TS catches typos at compile time
// and the return type T[K] is the exact type of that property, not a broad union.
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const accountName = pluck(account, 'name'); // hover: string
const isAdmin = pluck(account, 'isAdmin'); // hover: boolean
// @ts-expect-error — 'email' is not a key of account
pluck(account, 'email');

// Note: we don't need `T extends object` here — `K extends keyof T` already
// ensures the key exists on T. TS will figure out the valid keys for any T,
// whether it's an object, array, or even a string (which has "length", "charAt", etc.).

// --- Multiple constraints with & ---

// Sometimes a function needs multiple guarantees — e.g. "has an id" AND "has timestamps".
// Use & to require T satisfies all of them at once.

interface HasId {
  id: number;
}
interface HasTimestamps {
  createdAt: Date;
  updatedAt: Date;
}
function logEntity<T extends HasId & HasTimestamps>(entity: T): void {
  console.log(`Entity #${entity.id}, created ${entity.createdAt.toISOString()}`);
}

logEntity({
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'First post', // extra properties are fine
});

// --- Constraining to specific string literals ---

// You can also constrain T to a union of specific values.
// This turns a function parameter into an enum-like whitelist.

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Without a generic — method is typed as Method, the exact literal is lost:
function requestSimple(method: Method, url: string) {
  return { method, url };
}

const r1 = requestSimple('GET', '/api/users');
r1.method; // hover: Method — TS only knows it's one of the four, not specifically "GET"

// With a generic — M preserves the exact literal you passed:
function request<M extends Method>(method: M, url: string) {
  return { method, url };
}

const r2 = request('GET', '/api/users');
r2.method; // hover: "GET" — TS remembers the exact value

// @ts-expect-error — 'PATCH' is not in Method
request('PATCH', '/api/users');

// --- Default type parameters ---

// Sometimes most callers use the same type. Instead of forcing everyone to write
// Pagination<string>, you can set a default so they just write Pagination.
interface Pagination<T = string> {
  items: T[];
  cursor: string;
  hasMore: boolean;
}

const stringPage: Pagination = {
  // T defaults to string
  items: ['a', 'b', 'c'],
  cursor: 'abc123',
  hasMore: true,
};

const numberPage: Pagination<number> = {
  // override the default
  items: [1, 2, 3],
  cursor: 'def456',
  hasMore: false,
};
