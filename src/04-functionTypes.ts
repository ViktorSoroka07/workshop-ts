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

// filter's callback type is `(value) => unknown` -- filter USES what you return (keeps truthy results):
const evens = [1, 2, 3].filter((n) => n % 2 === 0); // [2]

// That's the difference from `undefined` -- a `() => undefined` type really requires returning undefined:
type StrictCleanupFn = () => undefined;
// @ts-expect-error
const strictCleanup: StrictCleanupFn = () => subscribers.delete('analytics'); // Error: Type 'boolean' is not assignable to type 'undefined'

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

// Overloads also work on class constructors -- we will see it in the `classes` branch (11-constructorOverloads.ts).
