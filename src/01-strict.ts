// =============================================================================
// The `strict` Flag
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strict

// `strict: true` in tsconfig is a shortcut that enables all of these flags at once:
//
//   strictNullChecks          — null/undefined are their own types (see 02)
//   noImplicitAny             — error on untyped parameters (see 03)
//   strictPropertyInitialization — class properties must be initialized (see 04)
//   strictFunctionTypes       — stricter function type checking (see 05)
//   strictBindCallApply       — type-check bind/call/apply arguments
//   noImplicitThis            — error when `this` has an implied `any` type
//   alwaysStrict              — emit "use strict" in every output file
//   useUnknownInCatchVariables — catch variables are `unknown`, not `any` (see 09)

// Always start with `strict: true`. It's the recommended baseline for all
// TypeScript projects — you can opt out of individual flags if needed.
//
// The remaining files in this folder show what each flag catches.

export {};
