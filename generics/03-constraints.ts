// =============================================================================
// Constraints: Limiting What T Can Be
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints

// A bare `T` is any type at all, so inside the function you can do almost nothing with it.
// `T extends Shape` promises the function a minimum shape and still hands the caller back
// the full type they passed in.

export {};

// --- Why: a bare T has no properties ---

// @ts-expect-error
const brokenId = <T>(item: T) => item.id; // Error: Property 'id' does not exist on type 'T'.

// `extends` states the minimum the function needs:
function getId<T extends { id: number }>(item: T) {
  return item.id; // OK
}

getId({ id: 7, title: 'Generics 101' }); // OK -- extra properties are fine

// @ts-expect-error
getId({ title: 'Generics 101' }); // Error: Argument of type '{ title: string; }' is not assignable to parameter of type '{ id: number; }'.

// --- The constraint keeps the caller's full type ---

interface HasId {
  id: number;
}

interface Article {
  id: number;
  title: string;
}

// A parameter typed `HasId[]` accepts articles but hands back a plain `HasId`:
function findByIdLossy(items: HasId[], id: number) {
  return items.find((item) => item.id === id);
}

// The constraint accepts the same inputs and returns the same type that went in:
function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

const articles: Article[] = [{ id: 1, title: 'Generics 101' }];

const lossy = findByIdLossy(articles, 1); // type: HasId | undefined
const exact = findById(articles, 1); // type: Article | undefined

// @ts-expect-error
lossy?.title; // Error: Property 'title' does not exist on type 'HasId'.

console.log(exact?.title); // Generics 101

// --- Constraining to object ---

// Merging only makes sense for objects. `extends object` rejects primitives:
function merge<First extends object, Second extends object>(
  first: First,
  second: Second
): First & Second {
  return { ...first, ...second };
}

const account = merge({ name: 'Alice' }, { role: 'admin' }); // type: { name: string; } & { role: string; }

// @ts-expect-error
merge('hello', 42); // Error: Argument of type 'string' is not assignable to parameter of type 'object'.

// @ts-expect-error
merge(null, { role: 'admin' }); // Error: Argument of type 'null' is not assignable to parameter of type 'object'.

// `object` means "any non-primitive". Despite `typeof null === 'object'` in JavaScript, it excludes null.

// --- Several requirements at once: & ---

interface HasTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

// An intersection (../types/12-intersectionTypes.ts) demands both shapes:
function describeEntity<T extends HasId & HasTimestamps>(entity: T): string {
  return `#${entity.id}, created ${entity.createdAt.toISOString()}`;
}

describeEntity({
  id: 1,
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-02-01'),
  title: 'First post',
}); // OK

// --- A constraint that keeps the literal ---

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// With a plain parameter type, the caller's exact value is forgotten:
function describeRequest(method: HttpMethod, url: string) {
  return { method, url };
}

const plain = describeRequest('GET', '/api/users');

plain.method; // type: HttpMethod

// With a type parameter constrained to the union, `T` stays as narrow as the argument:
function describeRequestExact<Method extends HttpMethod>(
  method: Method,
  url: string
) {
  return { method, url };
}

const exactRequest = describeRequestExact('GET', '/api/users');

exactRequest.method; // type: "GET"

// @ts-expect-error
describeRequestExact('PATCH', '/api/users'); // Error: Argument of type '"PATCH"' is not assignable to parameter of type 'HttpMethod'.

// --- Constraining one parameter by another: K extends keyof T ---

// Builds on ../types/14-typeofKeyofIndexedAccess.ts. A function that reads a property by key:
function pluckLoose(source: Record<string, unknown>, key: string) {
  return source[key];
}

const profile = { id: 1, name: 'Alice', isAdmin: true };

const looseName = pluckLoose(profile, 'name'); // type: unknown
const looseTypo = pluckLoose(profile, 'naem'); // OK -- the typo compiles and returns undefined at runtime

// Two problems: any string is accepted as a key, and the result is always `unknown`.
// Tying the key's type to the object's fixes both -- `K` can only be a key of `T`,
// and `T[K]` is the type of exactly that property:
function pluck<T, K extends keyof T>(source: T, key: K): T[K] {
  return source[key];
}

const profileName = pluck(profile, 'name'); // type: string
const isAdmin = pluck(profile, 'isAdmin'); // type: boolean

// @ts-expect-error
pluck(profile, 'email'); // Error: Argument of type '"email"' is not assignable to parameter of type '"name" | "id" | "isAdmin"'.

// ✅ Best practice: this `<T, K extends keyof T>` shape is the standard way to type
// "a key of this object" and it needs no `T extends object`.

// --- const type parameters ---

// By default an array literal argument widens to `string[]`, which loses the exact values:
function definePaths<Paths extends readonly string[]>(paths: Paths) {
  return paths;
}

const widened = definePaths(['/', '/about']); // type: string[]

// A `const` type parameter (TypeScript 5.0) asks for the `as const` treatment on the caller's
// argument, so the caller does not have to write it (see ../types/13-assertionsAndAsConst.ts):
function definePathsExact<const Paths extends readonly string[]>(paths: Paths) {
  return paths;
}

const exactPaths = definePathsExact(['/', '/about']); // type: readonly ["/", "/about"]
