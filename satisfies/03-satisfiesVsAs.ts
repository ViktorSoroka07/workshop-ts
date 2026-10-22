// =============================================================================
// `satisfies` vs `as`
// =============================================================================

// `as` (../types/13-assertionsAndAsConst.ts) says "trust me, this is a T". It checks
// far less than an annotation or `satisfies` does, so on a value you are writing out
// yourself it hides mistakes.

import type { AppConfig } from './AppConfig';

// --- `as` accepts an extra property ---
const extraConfig = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  debugMode: true,
} as AppConfig; // OK

// --- `as` accepts a missing property ---
const emptyConfig = {} as AppConfig; // OK

function hostOf(config: AppConfig) {
  return config.apiUrl.host;
}

// hostOf(emptyConfig) compiles and throws at runtime:
// TypeError: Cannot read properties of undefined (reading 'host')

const missingConfig = {
  apiUrl: { host: '/api', port: 8080 },
  // @ts-expect-error
} satisfies AppConfig; // Error: Type '{ apiUrl: { host: string; port: number; }; }' does not satisfy the expected type 'AppConfig'.

// --- `as` still refuses values that cannot be a T at all ---
type Server = { port: number | string };

// @ts-expect-error
const wrongKindServer = { port: true } as Server; // Error: Conversion of type '{ port: boolean; }' to type 'Server' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

// --- The same value three ways ---
const annotatedServer: Server = { port: 8080 };
const assertedServer = { port: 8080 } as Server;
const checkedServer = { port: 8080 } satisfies Server;

// What each form does to the variable:
//
//                  extra key   missing key   wrong value   type afterwards
//   annotation     error       error         error         the annotation (Server)
//   as             allowed     allowed       error         the assertion (Server)
//   satisfies      error       error         error         the value's own: { port: number }
//
// "wrong value" is an error for `as` only when the types share nothing in common.

// ✅ Best practice: use `as` where TypeScript cannot know the type (DOM lookups, parsed
// JSON), and `satisfies` where it can check the value and you want to keep what it inferred.
