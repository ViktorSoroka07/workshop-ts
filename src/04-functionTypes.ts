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

const ascending: Comparator = (a, b) => a - b; // `a` and `b` inferred as number
[3, 1, 2].sort(ascending); // [1, 2, 3]

// `interface` can describe a function too -- with a call signature (`:` instead of `=>`):
interface ComparatorInterface {
  (a: number, b: number): number;
}

const descending: ComparatorInterface = (a, b) => b - a;
// `type` with `=>` is the usual choice; the interface form pays off when the function also has properties (next).

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
function fetchUsers(url: string, onSuccess: (emails: string[]) => void) {
  onSuccess(['alice@example.com', 'bob@example.com']);
}

fetchUsers('/api/users', (emails) => {
  console.log(emails.length); // `emails` inferred as string[] from the callback type -- no annotation needed
});

// --- void: two meanings, depending on where you write it ---
//   On the function itself (`function f(): void`, `(): void => ...`):  "returns nothing"
//   In a function type     (`type Fn = () => void`):                  "return anything, callers can't use it"

// 1) On the function itself -- "returns nothing":
function logRequest(method: string, url: string): void {
  console.log(`${method} ${url}`); // no return statement needed
}

const subscribers = new Set<string>(['analytics']);

// So returning a value is an error:
function removeSubscriber(): void {
  // @ts-expect-error
  return subscribers.delete('analytics'); // Error: Type 'boolean' is not assignable to type 'void'
}

// 2) In a function type -- "return anything, callers can't use it":
type CleanupFn = () => void;
const unsubscribe: CleanupFn = () => subscribers.delete('analytics'); // OK -- any function fits

// Calling it gives `void`, even though a boolean comes back at runtime:
const result = unsubscribe(); // type: void
// @ts-expect-error
const label = unsubscribe() ? 'removed' : 'missing'; // Error: An expression of type 'void' cannot be tested for truthiness

// forEach's callback type is `(value) => void` -- forEach ignores what you return:
const copy: number[] = [];
[1, 2, 3].forEach((n) => copy.push(n)); // OK -- push returns a number, forEach drops it

// filter is different -- it USES what your callback returns (keeps items where it's truthy):
const evens = [1, 2, 3].filter((n) => n % 2 === 0); // [2]

// That's the difference from `undefined` -- a `() => undefined` type really requires returning undefined:
type StrictCleanupFn = () => undefined;
// @ts-expect-error
const strictCleanup: StrictCleanupFn = () => subscribers.delete('analytics'); // Error: Type 'boolean' is not assignable to type 'undefined'

// --- Overloads ---
// Several signatures for one function. Callers see only the signatures WITHOUT a body;
// the last one (with the body) is the implementation -- it must handle every case.

// 1) The return type depends on the argument:
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

// 2) Only certain argument combinations are allowed -- the body checks which one it got:
function createDate(timestamp: number): Date;
function createDate(year: number, month: number, day: number): Date;
function createDate(
  yearOrTimestamp: number,
  month?: number,
  day?: number
): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(yearOrTimestamp, month - 1, day); // called as (year, month, day)
  }
  return new Date(yearOrTimestamp); // called as (timestamp)
}

createDate(1_700_000_000_000); // OK -- hover: createDate(timestamp: number): Date (+1 overload)
createDate(2026, 10, 21); // OK
// @ts-expect-error
createDate(2026, 10); // Error: No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments
// The implementation accepts 2 arguments (`day?`), but callers can't see it -- only the overloads count.

// Use overloads when a single signature is not precise enough:
//   - with one signature `(year, month?, day?)`, `createDate(2026, 10)` compiles -- overloads reject it
//   - with one signature `(tag: string): HTMLElement`, `createElement('input')` loses HTMLInputElement
// If every combination of arguments is valid, one signature with optional parameters
// (like `createConnection` above) is simpler.
