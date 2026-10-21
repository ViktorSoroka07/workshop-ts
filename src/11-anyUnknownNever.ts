// =============================================================================
// 11. `any`, `unknown`, and `never`
// =============================================================================

// --- any: opts out of type checking (escape hatch) ---
let payload: any = JSON.parse('{"userId": 1, "action": "login"}');
payload.anything.goes.here; // no error -- TypeScript stops checking

// `any` is CONTAGIOUS: it silently disables checking on anything it touches.
const action: number = payload.action; // no error -- but at runtime it's "login"
action.toFixed(2); // no error -- hover says `number`; at runtime: TypeError: action.toFixed is not a function

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
// `ApiResponse` comes from 08-discriminatedUnions.ts:
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
