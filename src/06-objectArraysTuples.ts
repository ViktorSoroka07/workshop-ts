// =============================================================================
// 6. The `object` Type, Arrays, Tuples
// =============================================================================

// --- object ---
// `object` means "any non-primitive" -- rarely what you actually want:
let metadata: object = { version: '1.0' }; // OK
metadata = [1, 2, 3]; // OK (arrays are objects)
metadata = function () {}; // OK (functions are objects)
// @ts-expect-error
metadata = 'hello'; // Error: string is a primitive

// The problem: `object` tells you almost nothing -- you can't access any properties:
const serverInfo: object = { host: 'localhost', port: 5432 };
// @ts-expect-error
serverInfo.host; // Error: Property 'host' does not exist on type 'object'

// Compare with a specific shape -- full autocomplete and type safety:
const dbConfig: { host: string; port: number } = {
  host: 'localhost',
  port: 5432,
};
dbConfig.host; // OK -- TypeScript knows this is a string

// --- Index signatures ---
// When you don't know property names ahead of time, use an index signature
// to describe the shape of dynamic keys:
type HttpHeaders = {
  [header: string]: string;
};

const headers: HttpHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer token123',
};
headers['X-Custom'] = 'value'; // OK -- any string key is allowed

// You can mix known and dynamic properties:
type ApiConfig = {
  baseUrl: string;
  timeout: number;
  [header: string]: string | number; // must be compatible with the known properties
};

// Numeric index signatures work too -- this is how arrays are typed internally:
type StringArray = {
  [index: number]: string;
};

const colors: StringArray = { 0: 'red', 1: 'green', 2: 'blue' };

// Gotcha: accessing a key that doesn't exist returns `undefined` at runtime,
// but TypeScript still says the type is `string` -- no error, no warning:
const missing = headers['X-Not-Set']; // type: string, actual value: undefined
missing.toUpperCase(); // no error -- at runtime: TypeError: Cannot read properties of undefined

// This is a known blind spot. The `noUncheckedIndexedAccess` flag closes it
// (flags branch, 06-noUncheckedIndexedAccess).

// --- Arrays ---
const responseTimes: number[] = [120, 95, 210, 180];
// Equivalent generic syntax:
const supportedLocales: Array<string> = ['en', 'fr', 'de', 'ja'];

// Readonly arrays prevent mutation -- push, pop, splice, index assignment all become errors:
const requiredScopes: readonly string[] = ['read:user', 'write:repo'];
// @ts-expect-error
requiredScopes.push('admin'); // Error: Property 'push' does not exist on type 'readonly string[]'
// @ts-expect-error
requiredScopes[0] = 'delete:repo'; // Error: Index signature only permits reading

// Equivalent generic syntax:
const reservedPorts: ReadonlyArray<number> = [80, 443, 8080];

// A regular array is assignable TO a readonly array, but not the other way around:
const scopes: string[] = ['read', 'write'];
const frozenScopes: readonly string[] = scopes; // OK -- widening
// @ts-expect-error
const back: string[] = frozenScopes; // Error: 'readonly string[]' is not assignable to 'string[]'

// Useful in function signatures to signal "I won't modify your data":
function getTopHeaders(headers: readonly string[]) {
  return headers[0]; // can read, but can't push/pop/splice
}

// --- Tuples ---
// Fixed-length arrays with per-position types:
type DbRow = [id: number, email: string, active: boolean];
const row: DbRow = [1, 'alice@example.com', true];

// Named tuples improve readability:
type GeoPoint = [lat: number, lng: number];
const nyc: GeoPoint = [40.7128, -74.006];

// Optional elements and rest elements:
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

// Gotcha: without annotation, TS infers an array, NOT a tuple:
const pair = [200, 'OK']; // type: (string | number)[] -- not [number, string]
const [code] = pair; // type: string | number -- TS lost which position holds what
// @ts-expect-error
code.toFixed(); // Error: Property 'toFixed' does not exist on type 'string | number'
// Fix: annotate (`const pair: [number, string] = ...`) or `as const` (12-assertionsAndAsConst.ts).
