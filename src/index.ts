// =============================================================================
// Note: @ts-expect-error vs @ts-ignore
// =============================================================================
//
// Throughout this file we use `// @ts-expect-error` to intentionally demonstrate
// type errors. It suppresses the error on the NEXT line, similar to `@ts-ignore`.
//
// The key difference:
//   - @ts-ignore  -- silently suppresses the error, even if the error disappears
//                    (e.g., after a refactor). You'll never know the line is now valid.
//   - @ts-expect-error -- suppresses the error BUT fails if there is NO error.
//                    This means it breaks when the expected error goes away,
//                    alerting you that the comment is stale and should be removed.
//
// Prefer @ts-expect-error -- it's self-cleaning. @ts-ignore should only be used
// when you genuinely don't care whether the line has an error or not.

// =============================================================================
// 1. Primitive Types and Type Annotations
// =============================================================================

/*
  TypeScript's primitive types mirror JavaScript's:
  - string     - number      - boolean
  - null       - undefined   - symbol      - bigint
*/

let statusCode: number = 200;
let endpoint: string = '/api/v1/users';
let isAuthenticated: boolean = false;
let cachedResponse: null = null;
let authToken: undefined = undefined;

// `symbol` creates a globally unique key -- useful for non-colliding object properties:
const RequestId = Symbol('RequestId');
const Timestamp = Symbol('Timestamp');

type RequestMeta = {
  [RequestId]: string;
  [Timestamp]: number;
};

const meta: RequestMeta = {
  [RequestId]: 'req_abc123',
  [Timestamp]: Date.now(),
};

// Even symbols with the same description are different:
const a = Symbol('id');
const b = Symbol('id');
// @ts-expect-error
const same: true = a === b; // Error: This comparison appears to be unintentional (they're never equal)

// `bigint` handles integers beyond Number.MAX_SAFE_INTEGER (2^53 - 1):
const fileSize: bigint = 9_007_199_254_740_993n; // too large for `number`
const offset: bigint = 1024n;
const newOffset = fileSize + offset; // bigint + bigint = bigint

// bigint and number don't mix:
// @ts-expect-error
const bad = fileSize + 1; // Error: can't mix bigint and number

// With `strict: true` (our tsconfig), null/undefined are NOT assignable to other types:
// @ts-expect-error
let username: string = null; // Error: Type 'null' is not assignable to type 'string'

// =============================================================================
// 2. `let` vs `const` Type Inference
// =============================================================================

// `const` infers the *literal* type (the exact value), `let` infers the *widened* type:
const API_VERSION = 2; // type: 2 (literal)
let currentVersion = 2; // type: number (widened)

const DEFAULT_METHOD = 'GET'; // type: "GET" (literal)
let method = 'GET'; // type: string (widened)

// =============================================================================
// 3. Type Aliases and Interfaces
// =============================================================================

// Both give names to object shapes:
type UserType = {
  id: number;
  email: string;
  role?: 'admin' | 'editor' | 'viewer'; // optional property
};

interface UserInterface {
  id: number;
  email: string;
  role?: 'admin' | 'editor' | 'viewer';
}

// For object shapes, they are interchangeable. Where they diverge:

// --- What only `type` can do (interface CANNOT): ---

// 1. Alias primitives, unions, tuples:
type ID = string | number;
type HostPort = [string, number];

// 2. Mapped types, conditional types, template literal types, generic utility types (covered in the generics branch)

// You simply can't express any of the above with `interface`.

// --- What only `interface` can do (type CANNOT): ---

// 1. Declaration merging -- multiple declarations combine into one:
interface Window {
  analytics?: { track: (event: string) => void };
}
// Now `Window` has all its original properties PLUS `analytics`.
// This is how libraries extend built-in types (e.g., Express adding `req.body`).
// With `type`, a duplicate declaration is a compile error.

// --- Both can do: extending/composing ---

// `interface` uses `extends`:
interface TimestampedUser extends UserType {
  createdAt: Date;
}

const timestampedUser: TimestampedUser = {
  id: 1,
  email: 'alice@example.com',
  createdAt: new Date(),
};

// `type` uses `&` (intersection):
type TimestampedUserType = UserType & {
  createdAt: Date;
};

const timestampedUserType: TimestampedUserType = {
  id: 2,
  email: 'bob@example.com',
  createdAt: new Date(),
};

// Practical advice: use `interface` for public API shapes you want extensible,
// use `type` for everything else (unions, tuples, mapped types, utility compositions).

// =============================================================================
// 4. Function Types
// =============================================================================

// --- Typing parameters and return values ---
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// --- Optional and default parameters ---
function createConnection(host: string, port?: number) {
  return { host, port: port ?? 5432 }; // `port` is `number | undefined`
}

createConnection('localhost'); // OK -- port is optional
createConnection('localhost', 3306); // OK

function createLogger(prefix: string, silent: boolean = false) {
  return { prefix, silent }; // `silent` defaults to false
}

// --- Function type expressions ---
// Describe the shape of a function as a type:
type Comparator = (a: number, b: number) => number;

const byLength: Comparator = (a, b) => a - b;

// --- Call signatures in object types ---
type Logger = {
  level: string;
  (message: string): void; // this object is also callable
};

const logger: Logger = (message: string) => console.log(message);
logger.level = 'info';

logger('log message'); // callable
logger.level; // also has properties

// --- Typing callbacks ---
function fetchJSON(url: string, onSuccess: (data: unknown) => void) {
  // onSuccess is a callback that receives parsed data and returns nothing
  onSuccess({ users: [] });
}

fetchJSON('/api/users', (data) => {
  console.log(data); // `data` inferred as unknown from callback type
});

// --- void vs undefined ---
// `void` means "return value will not be used" -- not the same as `undefined`:
function logRequest(method: string, url: string): void {
  console.log(`${method} ${url}`);
  // no return statement needed
}

// Callback typed with `void` return CAN return a value -- it's just ignored:
type CleanupFn = () => void;
const unsubscribe = () => clearInterval(1); // OK -- return value is ignored

// --- Overloads ---
// Multiple signatures for different parameter combinations:
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: 'canvas'): HTMLCanvasElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

createElement('input'); // OK -- returns HTMLInputElement
createElement('canvas'); // OK -- returns HTMLCanvasElement
createElement('div'); // OK -- returns HTMLElement
// @ts-expect-error
createElement(42); // Error: no matching overload

// Overloads also work on class constructors -- we will see it in `2-classes` branch (constructorOverloads.ts).

// =============================================================================
// 5. Avoiding Redundant Type Annotations
// =============================================================================

// Now that we've seen types and functions, let's talk about when NOT to annotate.
// When TypeScript can infer the type, explicit annotations are redundant noise:

// Bad -- redundant annotations:
let maxRetries: number = 3;
let baseUrl: string = 'https://api.example.com';
let cacheEnabled: boolean = true;
const allowedPorts: number[] = [80, 443, 8080];

// Good -- let inference do its job:
let maxRetries2 = 3; // number
let baseUrl2 = 'https://api.example.com'; // string
let cacheEnabled2 = true; // boolean
const allowedPorts2 = [80, 443, 8080]; // number[]

// When you SHOULD annotate:

// 1. Variables without initializers:
let connectionString: string;
connectionString = 'postgres://localhost:5432/mydb';

// 2. When inference gives a wider type than you want:
let connectionState: 'connecting' | 'open' | 'closed' = 'closed'; // without annotation, inferred as string

// 3. Function parameters -- TypeScript cannot infer these:
function parsePort(raw: string) {
  return parseInt(raw, 10);
}

function toQueryString(params: { [key: string]: string }) {
  return new URLSearchParams(params).toString(); // return type inferred as `string`
}

// 4. Function return types -- but only when it actually helps:
//    - Public API / library functions (documents the contract):
function findUser(id: number): { id: number; email: string } | null {
  return { id, email: 'alice@example.com' };
}

//    Without the return type, a mistake silently changes the public API:
function findUserNoAnnotation(id: number) {
  // Forgot to handle the "not found" case -- but no error!
  // Callers won't know they should check for null.
  return { id, email: 'alice@example.com' };
}

//    With the explicit return type, TypeScript catches the same mistake:
//    With the explicit return type, the contract is enforced:
function findUserById(id: number): { id: number; email: string } | null {
  // Even though this always returns an object right now,
  // the `| null` return type forces callers to handle the null case.
  // If someone later adds a `return null` path, callers are already prepared.
  return { id, email: 'alice@example.com' };
}

const foundUser = findUserById(1);

foundUser?.id;

//    - When you want to catch mistakes early (complex return paths)
//    For simple/internal functions, let inference do the work.

// There's no tsconfig flag for this, but you can enforce it with ESLint:
// Rule: @typescript-eslint/no-inferrable-types
// It warns on `let x: number = 5` and suggests `let x = 5`.

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

// This is a known blind spot. You can fix it by enabling `noUncheckedIndexedAccess`
// in tsconfig -- it changes the type to `string | undefined`

missing.toUpperCase(); // Error: 'val' is possibly 'undefined' if `noUncheckedIndexedAccess` is enabled

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

// =============================================================================
// 7. Union Types
// =============================================================================

// A value that can be one of several types:
function formatId(id: string | number): string {
  // With a union, you can only access members common to ALL constituents:

  if (typeof id === 'string') {
    id.toUpperCase(); // Error: 'toUpperCase' does not exist on type 'number'
  }

  // You must narrow first (next section):
  return String(id);
}

formatId('abc-123'); // OK
formatId(42); // OK
// @ts-expect-error
formatId(true); // Error: 'boolean' is not assignable to 'string | number'

// Unions of literal types restrict values to an exact set:
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function sendRequest(url: string, method: HttpMethod) {
  console.log(`${method} ${url}`);
}

sendRequest('/api/users', 'GET'); // OK
// @ts-expect-error
sendRequest('/api/users', 'PATCH'); // Error: '"PATCH"' is not assignable to type 'HttpMethod'

// Numeric literal unions work too:
type HttpSuccessCode = 200 | 201 | 204;
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Union of object types:
type TextInput = { type: 'text'; value: string; maxLength: number };
type NumberInput = { type: 'number'; value: number; min: number; max: number };
type FormField = TextInput | NumberInput;

// You can only access shared properties without narrowing:
function getFieldValue(field: FormField) {
  return field.value; // OK -- both TextInput and NumberInput have `value`
}

// =============================================================================
// 8. Discriminated Unions
// =============================================================================

// A discriminated union is a union of object types where each member has
// a common property (the "discriminant") with a unique literal value.
// TypeScript uses that property to automatically narrow the type in branches.
//
// The pattern: shared tag field + switch/if → full type safety.
type SuccessResponse = { status: 'success'; data: string[] };
type ErrorResponse = { status: 'error'; message: string };
type LoadingResponse = { status: 'loading'; placeholder: 'Loading...' };

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse;

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      console.log(response.data); // narrowed to SuccessResponse
      break;
    case 'error':
      console.log(response.message); // narrowed to ErrorResponse
      break;
    case 'loading':
      console.log(response.placeholder); // narrowed to LoadingResponse
      console.log('Loading...');
      break;
  }
}

// This pattern is everywhere: Redux actions, XState events, tRPC responses.

// =============================================================================
// 9. Type Narrowing
// =============================================================================

// When you have a union type, TypeScript only lets you access members shared
// by ALL constituents. Narrowing is how you go from a broad type to a more
// specific one inside a branch, so you can safely use that type's full API.
// TypeScript tracks control flow (if/else, switch, return) to narrow automatically.

// --- typeof guard ---
function formatValue(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase(); // narrowed to string
  }
  return value.toFixed(2); // narrowed to number
}

// --- in guard (for objects) ---
function describeField(field: TextInput | NumberInput) {
  if ('maxLength' in field) {
    return `Text field (max ${field.maxLength} chars)`; // narrowed to TextInput
  }
  return `Number field (${field.min}–${field.max})`; // narrowed to NumberInput
}

// --- instanceof guard ---
function formatDate(input: string | Date): string {
  if (input instanceof Date) {
    return input.toISOString(); // narrowed to Date
  }
  return new Date(input).toISOString(); // narrowed to string
}

// --- Equality narrowing ---
function mergeIds(localId: string | number, remoteId: string | boolean) {
  if (localId === remoteId) {
    // Both must be string (the only overlap)
    localId.toUpperCase(); // narrowed to string
  }
}

// --- Truthiness narrowing ---
function getHeaderLength(header: string | null | undefined) {
  if (header) {
    console.log(header.length); // narrowed to string
  }
}

// Gotcha: typeof null === "object" -- a classic JS trap:
function parseHeader(header: string | null) {
  if (typeof header === 'object') {
    // header is narrowed to `null` here, NOT an object!
    // @ts-expect-error
    header.length; // Error: 'header' is possibly 'null'
  }
}

// --- Custom type guards (`is` keyword) ---
// Built-in narrowing (typeof, in, instanceof) works for simple cases.
// For complex validation -- especially narrowing `unknown` -- write a type guard:
// a function whose return type is `paramName is Type`.

// Without `is` -- returns boolean, TypeScript learns nothing in the caller:
function hasEmail(user: unknown): boolean {
  return typeof user === 'object' && user !== null && 'email' in user;
}

function notifyUser(user: unknown) {
  if (hasEmail(user)) {
    // @ts-expect-error
    user.email; // Error: 'user' is still `unknown` -- no narrowing happened!
  }
}

// With `is` -- same check, but now TypeScript narrows the type in the caller:
function hasEmailGuard(user: unknown): user is { email: string } {
  return typeof user === 'object' && user !== null && 'email' in user;
}

function notifyUser2(user: unknown) {
  if (hasEmailGuard(user)) {
    user.email; // OK -- narrowed to { email: string }
  }
}

// The more complex the validation, the more `is` pays off:

type ServerError = { code: number; message: string };

function isServerError(value: unknown): value is ServerError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as ServerError).code === 'number' &&
    typeof (value as ServerError).message === 'string'
  );
}

// Without `is`, this function would return `boolean` and TypeScript learns nothing.
// With `is`, the narrowing propagates to callers:
function handleUnknownError(err: unknown) {
  if (isServerError(err)) {
    console.log(err.code); // narrowed to ServerError
    console.log(err.message); // narrowed to ServerError
  }
}

// Works great with .filter() -- without `is`, the result stays as the union:
type LogEvent =
  | { level: 'error'; error: Error }
  | { level: 'info'; message: string };

function isErrorEvent(event: LogEvent): event is LogEvent & { level: 'error' } {
  return event.level === 'error';
}

const events: LogEvent[] = [
  { level: 'info', message: 'started' },
  { level: 'error', error: new Error('disk full') },
];

const errors = events.filter(isErrorEvent);

// type: (LogEvent & { level: "error" })[] -- narrowed!
// Without `is`, this would be LogEvent[] -- no narrowing.

// =============================================================================
// 10. Intersection Types
// =============================================================================

// Unions mean "one OR the other"; intersections mean "both at the same time":
type Timestamped = { createdAt: Date; updatedAt: Date };
type SoftDeletable = { deletedAt: Date | null };

type User = UserType & Timestamped & SoftDeletable;

// Must satisfy ALL combined shapes:
const user: User = {
  id: 1,
  email: 'alice@example.com',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

// Intersecting incompatible primitives produces `never`:
type Impossible = string & number; // never

// =============================================================================
// 11. `any`, `unknown`, and `never`
// =============================================================================

// --- any: opts out of type checking (escape hatch) ---
let payload: any = JSON.parse('{"userId": 1, "action": "login"}');
payload.anything.goes.here; // no error -- TypeScript stops checking
// `any` is CONTAGIOUS: it silently disables checking on anything it touches.

// --- unknown: safe top type (must narrow before use) ---
let parsed: unknown = JSON.parse('{"userId": 1, "action": "login"}');
// @ts-expect-error
parsed.userId; // Error: 'parsed' is of type 'unknown'

// Must narrow first:
if (typeof parsed === 'object' && parsed !== null && 'userId' in parsed) {
  console.log(parsed.userId); // OK after narrowing
}

// Prefer `unknown` over `any` whenever possible.

// --- never: the bottom type (no value can exist) ---

// A function that never returns:
function throwError(message: string): never {
  throw new Error(message);
}

// Exhaustive check pattern -- catches missing cases at compile time:
function getStatusLabel(response: ApiResponse): string {
  switch (response.status) {
    case 'success':
      return 'Done';
    case 'error':
      return 'Failed';
    case 'loading':
      return 'Loading...';
    default:
      // If a new status is added to ApiResponse but not handled above,
      // this line will produce a compile error:
      const _exhaustive: never = response;
      return _exhaustive;
  }
}

// Try it: add `{ status: "retrying" }` to ApiResponse and watch this function fail to compile.

// =============================================================================
// 12. Type Assertions and `as const`
// =============================================================================

// --- `as` assertion: you tell TypeScript what a type is ---
const emailInput = document.getElementById('email') as HTMLInputElement;
emailInput.value; // OK -- you asserted it's an HTMLInputElement

// WARNING: `as` does NOT perform a runtime check. If wrong, you get runtime errors.
// Prefer narrowing over assertions whenever possible:
const el = document.getElementById('email');
if (el instanceof HTMLInputElement) {
  el.value; // safely narrowed, no assertion needed
}

// --- `as const`: freeze to the narrowest literal type ---
const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
} as const;

// Without `as const`: { home: string; about: string; contact: string }
// With `as const`:    { readonly home: "/"; readonly about: "/about"; readonly contact: "/contact" }

// `as const` also fixes the tuple inference problem from Section 6:
const point = [40.7128, -74.006] as const; // type: readonly [40.7128, -74.006]

// =============================================================================
// 13. Enums vs Literal Unions
// =============================================================================

// Enums generate real JavaScript code -- they exist at runtime as objects.
// Literal unions (e.g., `type Method = 'GET' | 'POST'`) are erased at compile time
// and produce zero JavaScript output.

// --- Numeric enum ---
enum Priority {
  Low, // 0
  Medium, // 1
  High, // 2
  Critical, // 3
}

console.log(Priority.High); // 2
console.log(Priority[0]); // "Low" (reverse mapping -- numeric enums only)

// --- String enum ---
enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}

// --- const enum (inlined at compile time, no runtime object) ---
const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

const level = LogLevel.Info; // compiles to: const level = 1;

// Caveat: `const enum` only works when `tsc` compiles the whole project.
// Single-file transpilers (Babel, SWC, esbuild) process each file in isolation --
// they can't look up the enum definition from another file to inline the values.
// The tsconfig flag `isolatedModules: true` warns about this and other patterns
// that break under single-file transpilation. Most modern setups enable it.
// For this reason, the community generally prefers `as const` objects (see below).

// --- Alternative: `as const` object + derived union (community-preferred) ---
const HttpStatus = {
  Ok: 200,
  NotFound: 404,
  ServerError: 500,
} as const;

// `typeof` extracts the type from a value, `keyof` gets its keys as a union.
// Combined, this derives a union of the object's values:
type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus]; // 200 | 404 | 500
// These operators are covered in depth in Section 14.

// Why prefer this over an enum?
// - No extra runtime code generated
// - Works with --isolatedModules (const enums don't -- see caveat above)
// - Standard JavaScript object -- no TS-specific syntax

// =============================================================================
// 14. Utility Type Operators: typeof, keyof, Indexed Access, Record
// =============================================================================

// Build up a realistic example step by step:

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
} as const;

// `typeof` extracts a type from a value:
type Config = typeof config;
// { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; readonly retries: 3 }

// `keyof` gets the union of keys:
type ConfigKey = keyof Config; // "apiUrl" | "timeout" | "retries"

// Indexed access gets value types:
type ConfigValue = Config[ConfigKey]; //  "https://api.example.com" | 5000 | 3
type Timeout = Config['timeout']; // 5000

// Extract element type from an array:
const endpoints = [
  { path: '/api/users', method: 'GET' as const, auth: true },
  { path: '/api/health', method: 'GET' as const, auth: false },
];

type Endpoint = (typeof endpoints)[number];
// { path: string; method: "GET"; auth: boolean }

type EndpointKey = keyof Endpoint; // "path" | "method" | "auth"

// Type-safe property accessor:
function getEndpointProp(endpoint: Endpoint, key: EndpointKey) {
  return endpoint[key];
}

getEndpointProp(endpoints[0], 'path'); // OK
// @ts-expect-error
getEndpointProp(endpoints[0], 'url'); // Error: '"url"' is not assignable to type 'EndpointKey'
