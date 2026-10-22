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
//   strictBindCallApply       — type-check bind/call/apply arguments (see 11)
//   noImplicitThis            — error when `this` has an implied `any` type (see 12)
//   alwaysStrict              — emit "use strict" in every output file
//   useUnknownInCatchVariables — catch variables are `unknown`, not `any` (see 09)

// Always start with `strict: true`. It's the recommended baseline for all
// TypeScript projects — you can opt out of individual flags if needed.
//
// The remaining lessons in this workshop show what each flag catches.

// -----------------------------------------------------------------------------
// TypeScript 7 (GA July 2026): `strict` is ON BY DEFAULT
// -----------------------------------------------------------------------------
// From TypeScript 7 you no longer switch strict mode on — you switch it off.
// An empty tsconfig already reports:
//
//   function f(x) { ... }        error TS7006: Parameter 'x' implicitly has an 'any' type.
//   const s: string = null;      error TS2322: Type 'null' is not assignable to type 'string'.
//
// So `"strict": true` becomes a no-op you can delete, and a codebase that was
// relying on the old loose default now fails to compile until it is annotated.
// If you need the old behaviour while migrating, set the individual flags off
// (`"noImplicitAny": false`) rather than looking for a `"strict": false` escape
// hatch to add later — see lesson 20.

export {};
