// =============================================================================
// Options removed in TypeScript 7
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-7-0.html

// TypeScript 7 (GA July 2026) is the compiler rewritten in Go. The TYPE SYSTEM
// did not change — everything in lessons 01–19 means exactly what it meant
// before. What changed is the configuration surface: options deprecated in
// TypeScript 6 became hard errors, and old emit targets were dropped outright.
//
// This lesson is a reference list, not an exercise. Each entry below was
// checked against tsc 7.0.2; the error code is what you actually get.

// -----------------------------------------------------------------------------
// Removed — the compiler refuses to start
// -----------------------------------------------------------------------------
//
//   "target": "es5"                 TS5108   ES2015 is the lowest target now
//   "downlevelIteration": true      TS5102   only ever affected ES5 emit
//   "module": "amd" | "umd"         TS5108   use ESM, or a bundler
//   "module": "system"              TS5108
//   "moduleResolution": "node"      TS5108   normalised to node10, then removed
//   "moduleResolution": "node10"    TS5108
//   "moduleResolution": "classic"   TS5108
//   "baseUrl": "."                  TS5102   inline the prefix into each `paths` entry
//
// Replacements: target ES2015 or later; module `esnext`/`preserve`/`commonjs`;
// moduleResolution `bundler` or `nodenext`.

// -----------------------------------------------------------------------------
// Syntax that became an error
// -----------------------------------------------------------------------------
//
//   module Legacy { }               TS1540   use `namespace Legacy { }`
//
// The `module` keyword form of a namespace is gone. See the `namespaces`
// branch — namespaces themselves still exist, you just cannot spell them the
// 2012 way.

// -----------------------------------------------------------------------------
// New defaults
// -----------------------------------------------------------------------------
//
//   strict              now ON by default (lesson 01)
//   moduleResolution    now defaults to `bundler`
//
// Set `moduleResolution` explicitly anyway. A config that relied on the old
// default is the single most common thing that breaks on upgrade, because the
// two defaults it might have inherited — `classic` and `node10` — are both
// among the removed options above.

// -----------------------------------------------------------------------------
// What is NOT ready yet
// -----------------------------------------------------------------------------
//
// - The stable programmatic compiler API lands in 7.1, not 7.0. Tooling that
//   imports `typescript` and walks the AST should wait.
// - typescript-eslint (8.68.0 at the time of writing) still declares
//   `peer typescript ">=4.8.4 <6.1.0"`. If you lint with it — this workshop
//   does — you cannot move to 7 yet without breaking `npm run lint`.
//
// That is why this branch still pins TypeScript 6. The `native-compiler`
// branch runs on 7 and has no eslint dependency, so it can.

export {};
