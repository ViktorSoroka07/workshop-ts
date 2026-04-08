import { Config } from './Config';

// =============================================================================
// `as` Type Assertion vs `satisfies`
// =============================================================================

// `as` tells TypeScript: "trust me, I know the type."
// It's an escape hatch — useful in rare cases, but it skips important checks.

// ---------------------------------------------------------------------------
// Problem 1: `as` allows extra properties
// ---------------------------------------------------------------------------

const configAs1 = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  debugMode: true, // ✅ No error — `as` doesn't check for extra properties
} as Config;

// `satisfies` catches this:
const configSatisfies1 = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  // @ts-expect-error
  debugMode: true, // ❌ Error — property doesn't exist in Config
} satisfies Config;

// ---------------------------------------------------------------------------
// Problem 2: `as` allows missing required properties
// ---------------------------------------------------------------------------

// This is the most dangerous aspect of `as`. You can create an object
// that claims to be Config but is completely empty:

const configAs2 = {} as Config;

// TS thinks `configAs2` is a valid Config, so it allows this:
console.log(configAs2.apiUrl.host); // compiles fine, but CRASHES at runtime!
//                                     TypeError: Cannot read property 'host' of undefined

// You could use this pattern to build an object incrementally:
const configAs3 = {} as Config;
configAs3.apiUrl = { host: '/api', port: 8080 };
configAs3.retryCount = 3;

// but if you forget a property, TS won't warn you — the bug is silent.

// `satisfies` requires all properties to be present:
//
const configSatisfies2 = {
  apiUrl: { host: '/api', port: 8080 },
  // @ts-expect-error
} satisfies Config;
//   // ❌ Error — Property 'retryCount' is missing

// ---------------------------------------------------------------------------
// Problem 3: `as` widens the type
// ---------------------------------------------------------------------------

// After `as Config`, the variable's type is `Config` — you lose specific inference.

const configAs4 = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
} as Config;

configAs4.retryCount; // type: number (that's all TS knows)

// With `satisfies`, TS validates against Config but keeps the inferred type:

const configSatisfies3 = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
} satisfies Config;

configSatisfies3.retryCount; // type: number (same here, but the difference shows with literals — see file 3)

// ---------------------------------------------------------------------------
// When `as` IS appropriate
// ---------------------------------------------------------------------------

// `as` has legitimate uses — it's not always wrong:

// 1. DOM APIs where TS can't know the specific element type:
const input = document.getElementById('email') as HTMLInputElement;
input.value; // TS now knows `.value` exists

// 2. Narrowing union types when you have runtime knowledge TS doesn't:
type ApiResult = { status: 'ok'; data: string } | { status: 'error'; message: string };
function handleResult(result: ApiResult) {
  if (result.status === 'ok') {
    // TS already narrows here — but sometimes you need `as` in more complex cases
    console.log(result.data);
  }
}

// 3. Working with external data (API responses, JSON parsing):
const parsed = JSON.parse('{"id": 1}') as { id: number };

// Rule of thumb: use `as` when TS CAN'T know the type (DOM, external data).
// Use `satisfies` when TS CAN check the type but you want to keep narrow inference.
