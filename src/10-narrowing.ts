// =============================================================================
// 10. Type Narrowing
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
// `TextInput` and `NumberInput` come from 08-unionTypes.ts:
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

    return;
  }

  // ⚠️ Gotcha: NOT equal tells TypeScript nothing about the types:
  localId; // still string | number -- 'abc' and 'xyz' are both strings, yet not equal
  remoteId; // still string | boolean
  // Compare `formatValue` above: `typeof` catches EVERY string, so after its return only `number` is left.
}

// --- Truthiness narrowing ---
function getHeaderLength(header: string | null | undefined) {
  if (header) {
    console.log(header.length); // narrowed to string
  }
}

// ⚠️ Gotcha: typeof null === "object" -- a classic JS trap:
function parseHeader(header: string | null) {
  if (typeof header === 'object') {
    // header is narrowed to `null` here, NOT an object!
    // @ts-expect-error
    header.length; // Error: 'header' is possibly 'null'
  }
}

// --- Narrowing `unknown` ---
// `parsed` (an `unknown` from 07-anyUnknownNever.ts) can't be used until you check it.
// The guards above do exactly that:
if (typeof parsed === 'object' && parsed !== null && 'userId' in parsed) {
  console.log(parsed.userId); // OK after narrowing
}

// --- Custom type guards (`is` keyword) ---
// That chain of checks is long, and you'd repeat it everywhere. A type guard puts it
// in one function: a function whose return type is `paramName is Type`.

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

// --- Type guards with .filter() ---
type LogEvent =
  | { level: 'error'; error: Error }
  | { level: 'info'; message: string };

const events: LogEvent[] = [
  { level: 'info', message: 'started' },
  { level: 'error', error: new Error('disk full') },
];

// For a simple check, TypeScript writes the `is` for you -- no annotation needed:
function isErrorEvent(event: LogEvent) {
  return event.level === 'error'; // hover `isErrorEvent`: returns `event is { level: "error"; error: Error }`
}

const errors = events.filter(isErrorEvent); // { level: "error"; error: Error }[] -- narrowed!
const errorsInline = events.filter((event) => event.level === 'error'); // same result, inline

// ⚠️ Gotcha: writing `: boolean` yourself throws the inferred `is` away:
function isErrorEventBoolean(event: LogEvent): boolean {
  return event.level === 'error';
}

const notNarrowed = events.filter(isErrorEventBoolean); // LogEvent[] -- no narrowing

// ✅ Best practice: write `is` yourself only when TypeScript can't prove it from the check --
// like `isServerError` above.
