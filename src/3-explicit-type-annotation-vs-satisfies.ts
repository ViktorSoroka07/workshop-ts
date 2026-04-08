import { Config } from './Config';

// =============================================================================
// Explicit Type Annotation vs `satisfies`
// =============================================================================

// Explicit annotation (`const x: Type = ...`) is the most common way to type
// a variable. It's safe — unlike `as`, it catches extra and missing properties.
// But it widens the variable's type to the annotation, which can lose information.

// ---------------------------------------------------------------------------
// Annotation is safe — it validates the shape
// ---------------------------------------------------------------------------

const config: Config = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  // @ts-expect-error
  debugMode: true, // ❌ Error — extra property not in Config
};

// This is the same behavior as `satisfies` — both catch extra properties.
// So what's the difference?

// ---------------------------------------------------------------------------
// Problem: annotation widens the type
// ---------------------------------------------------------------------------

// When you annotate, the variable's type becomes the annotation — not the value.
// For `Config` this doesn't matter much (string is string). But with wider types
// like `Record<string, ...>`, you lose the actual keys:

type Routes = Record<string, {}>;

const routes: Routes = {
  '/users': {},
  '/admin/users': {},
};

// TS only knows the type is `Record<string, {}>`, so ANY key is valid:
routes.whatever;       // ✅ No error — TS has no idea which keys actually exist
routes.totallyInvalid; // ✅ No error — same problem

// With `satisfies`, TS validates against Routes but keeps the literal keys:

const routes1 = {
  '/users': {},
  '/admin/users': {},
} satisfies Routes;

routes1['/users'];     // ✅ Works
// @ts-expect-error
routes1.whatever;      // ❌ Error — TS knows only '/users' and '/admin/users' exist

// ---------------------------------------------------------------------------
// Another example: event handlers
// ---------------------------------------------------------------------------

type EventHandlers = Record<string, (...args: unknown[]) => void>;

// With annotation — any event name is accepted, even typos:
const handlers: EventHandlers = {
  onClick: () => console.log('clicked'),
  onHover: () => console.log('hovered'),
};

handlers.onClck; // ✅ No error — TS can't catch the typo

// With satisfies — TS knows exactly which handlers exist:
const handlers1 = {
  onClick: () => console.log('clicked'),
  onHover: () => console.log('hovered'),
} satisfies EventHandlers;

// @ts-expect-error
handlers1.onClck; // ❌ Error — did you mean 'onClick'?

// ---------------------------------------------------------------------------
// When to prefer explicit annotation
// ---------------------------------------------------------------------------

// Annotation is still the right choice when:

// 1. Function parameters and return types — `satisfies` can't be used here:
function getConfig(): Config {
  return { apiUrl: { host: '/api', port: 8080 }, retryCount: 3 };
}

// 2. When you WANT the wider type — e.g., a map you'll add keys to later:
const cache: Record<string, unknown> = {};
cache.userId = 123;     // ✅ This is the point — flexible keys
cache.anything = 'ok';  // ✅

// 3. When the variable is reassigned with different shapes:
let current: Config = { apiUrl: { host: '/api', port: 8080 }, retryCount: 3 };
current = { apiUrl: { host: '/other', port: 9090 }, retryCount: 5 };

// ---------------------------------------------------------------------------
// Summary: annotation vs satisfies
// ---------------------------------------------------------------------------

// Explicit annotation:
//   - Widens the type to the annotation
//   - Use for function params/returns, flexible containers, reassignable variables

// satisfies:
//   - Validates shape but keeps the narrow inferred type
//   - Use for config objects, lookup tables, constants — anywhere you want
//     both validation AND specific type information
