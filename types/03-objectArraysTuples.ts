// =============================================================================
// 3. The `object` Type, Arrays, Tuples
// =============================================================================

// --- object ---
// `object` means "any non-primitive" -- rarely what you actually want:
let metadata: object = { version: '1.0' }; // OK
metadata = [1, 2, 3]; // OK (arrays are objects)
metadata = function () {}; // OK (functions are objects)
// @ts-expect-error
metadata = 'hello'; // Error: Type 'string' is not assignable to type 'object'. (a string is a primitive)

// The problem: `object` tells you almost nothing -- you can't access any properties:
const serverInfo: object = { host: 'localhost', port: 5432 };
// @ts-expect-error
serverInfo.host; // Error: Property 'host' does not exist on type 'object'.

// Compare with a specific shape -- full autocomplete and type safety:
const dbConfig: { host: string; port: number } = {
  host: 'localhost',
  port: 5432,
};

dbConfig.host; // OK -- TypeScript knows this is a string

// --- Arrays ---
const responseTimes: number[] = [120, 95, 210, 180];

// Equivalent generic syntax -- `<...>` hands a type to another type (../generics/):
const supportedLocales: Array<string> = ['en', 'fr', 'de', 'ja'];

// Readonly arrays prevent mutation -- push, pop, splice, index assignment all become errors:
const requiredScopes: readonly string[] = ['read:user', 'write:repo'];
// @ts-expect-error
requiredScopes.push('admin'); // Error: Property 'push' does not exist on type 'readonly string[]'.
// @ts-expect-error
requiredScopes[0] = 'delete:repo'; // Error: Index signature in type 'readonly string[]' only permits reading.

// Equivalent generic syntax:
const reservedPorts: ReadonlyArray<number> = [80, 443, 8080];

// A regular array is assignable TO a readonly array, but not the other way around:
const scopes: string[] = ['read', 'write'];
const frozenScopes: readonly string[] = scopes; // OK -- widening
// @ts-expect-error
const back: string[] = frozenScopes; // Error: The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.

// Useful in function signatures to signal "I won't modify your data":
function getTopHeaders(headers: readonly string[]) {
  return headers[0]; // can read, but can't push/pop/splice
}

// --- Tuples ---
// Fixed-length arrays with per-position types. Use one for a small record where the position
// carries the meaning (like `useState`'s result below); for named fields, use an object.
type DbRow = [id: number, email: string, active: boolean];

const row: DbRow = [1, 'alice@example.com', true];
// @ts-expect-error
const shortRow: DbRow = [1, 'alice@example.com']; // Error: Type '[number, string]' is not assignable to type 'DbRow'. (Source has 2 element(s) but target requires 3)
// @ts-expect-error
const shuffledRow: DbRow = ['alice@example.com', 1, true]; // Error: Type 'string' is not assignable to type 'number'. (position 0 is the `id`)

// Named tuples improve readability -- compare the labelled tuple with an unlabelled one:
type GeoPoint = [lat: number, lng: number];

const nyc: GeoPoint = [40.7128, -74.006]; // type: GeoPoint -- hover `GeoPoint` to see [lat: number, lng: number]
const unnamedNyc: [number, number] = [40.7128, -74.006]; // type: [number, number] -- which one is the latitude?

// Optional elements (`?`) come last:
type Dimensions = [width: number, height: number, depth?: number];

const flatBox: Dimensions = [10, 20]; // OK -- `depth` is optional
const box: Dimensions = [10, 20, 30]; // OK

// A rest element takes any number of trailing items:
type LogEntry = [
  timestamp: number,
  level: string,
  message: string,
  ...tags: string[],
];

const entry: LogEntry = [
  Date.now(),
  'INFO',
  'User logged in',
  'auth',
  'session',
];

// Common real-world tuple: React's useState return
// const [count, setCount] = useState(0); // returns [number, Dispatch<SetStateAction<number>>]

// ⚠️ Gotcha: without annotation, TS infers an array, NOT a tuple:
const pair = [200, 'OK']; // type: (string | number)[] -- not [number, string]
const [code] = pair; // type: string | number -- TS lost which position holds what
// @ts-expect-error
code.toFixed(); // Error: Property 'toFixed' does not exist on type 'string | number'.
// Fix: annotate (`const pair: [number, string] = ...`) or `as const` (13-assertionsAndAsConst.ts).
