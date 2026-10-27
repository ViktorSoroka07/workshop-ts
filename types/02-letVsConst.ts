// =============================================================================
// 2. `let` vs `const` Type Inference
// =============================================================================

// Why it matters: only a literal type fits a union of exact values (09-unionTypes.ts),
// so whether a variable keeps `"GET"` or widens to `string` decides where it can be used.

// `const` infers the *literal* type (the exact value), `let` infers the *widened* type:
const API_VERSION = 2; // type: 2 (literal)
let currentVersion = 2; // type: number (widened)

const DEFAULT_METHOD = 'GET'; // type: "GET" (literal)
let method = 'GET'; // type: string (widened)

// A widened type takes any value of its kind; a literal type takes only its own value:
currentVersion = 3; // OK
let exactVersion: 2 = 2;
// @ts-expect-error
exactVersion = 3; // Error: Type '3' is not assignable to type '2'.

// `const` can keep the literal because it can never change:
// @ts-expect-error
API_VERSION = 3; // Error: Cannot assign to 'API_VERSION' because it is a constant.

// ⚠️ Gotcha: `const` fixes the variable, not what is inside it -- an object's properties still widen:
const request = { method: 'GET' }; // type: { method: string; }
request.method = 'POST'; // OK -- `method` is a plain string
// Fix: `as const` (13-assertionsAndAsConst.ts).
