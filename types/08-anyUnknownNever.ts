// =============================================================================
// 8. `any`, `unknown`, and `never`
// =============================================================================

// A server response arrives as text. `JSON.parse` turns it into an object, but TypeScript
// can't know what's inside the string -- so `JSON.parse` returns `any`:
const responseBody = '{"userId": 1, "action": "login"}'; // what the server sends: a string

// Where the three sit among the other types:
//
//   unknown        top: every value fits, but nothing may be done with it until it is checked
//     |
//   string, number, { id: number }, ...   the ordinary types
//     |
//   never          bottom: no value fits
//
//   any            sits outside this line: it switches the checker off instead

// --- any: opts out of type checking (escape hatch) ---
let payload: any = JSON.parse(responseBody); // `: any` only makes visible what JSON.parse returns anyway
payload.anything.goes.here; // no error -- TypeScript stops checking

// ⚠️ Gotcha: `any` is CONTAGIOUS -- it silently disables checking on anything it touches.
const action: number = payload.action; // no error -- but at runtime it's "login"
action.toFixed(2); // no error -- hover says `number`; at runtime: TypeError: action.toFixed is not a function

// --- unknown: "could be anything -- check before you use it" ---
// Same freedom to hold any value, but TypeScript refuses every use until you check it:
let parsed: unknown = JSON.parse(responseBody); // here the annotation matters: it replaces `any` with `unknown`
// @ts-expect-error
parsed.userId; // Error: 'parsed' is of type 'unknown'.
// @ts-expect-error
const rawText: string = parsed; // Error: Type 'unknown' is not assignable to type 'string'.

// Every value fits in -- the checking happens when you take it out:
let anything: unknown = 42; // OK
anything = 'text'; // OK

// How to check it is narrowing -- 10-narrowing.ts picks `parsed` up again.
// ✅ Best practice: prefer `unknown` over `any` whenever you don't know the type yet --
// e.g. type parsed server data as `unknown` and check it before use.

// --- never: the type with no values ---
// No value fits it, so every assignment fails:
// @ts-expect-error
const nothing: never = 1; // Error: Type '1' is not assignable to type 'never'.

// 1) A function that never returns -- it always throws (or loops forever):
function throwError(message: string): never {
  throw new Error(message);
}

// Compare with `void` (06-functionTypes.ts): a `void` function returns, just with nothing useful.
// A `never` function doesn't return at all -- so it can't even `return;`:
function neverReturns(): never {
  // @ts-expect-error
  return; // Error: Type 'undefined' is not assignable to type 'never'
}

// 2) TypeScript uses it: `never` disappears from the result type --
//    the branch that calls throwError produces no value:
function getPort(raw: string) {
  return raw !== '' ? parseInt(raw, 10) : throwError('Port is required');
}

const serverPort = getPort('5432'); // type: number -- not `number | never`

// 3) You'll meet `never` again when every possibility is ruled out:
//    - the exhaustive check in 11-discriminatedUnions.ts
//    - impossible intersections like `string & number` in 12-intersectionTypes.ts
