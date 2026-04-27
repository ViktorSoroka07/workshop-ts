// =============================================================================
// JS interop: allowJs, checkJs, // @ts-check
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#allowJs
// https://www.typescriptlang.org/tsconfig/#checkJs

// Three knobs that control how TypeScript treats `.js` files in your project.

// ---------------------------------------------------------------------------
// allowJs — include .js files in compilation
// ---------------------------------------------------------------------------

// Without `allowJs`, TS ignores .js files entirely. With it, .js files become
// part of the project — TS sees them, follows imports between .ts and .js,
// and produces type info even from JSDoc comments.
//
// Use it when:
//   - migrating a JS codebase to TS gradually
//   - your project mixes TS and authored JS (build scripts, legacy code)

// ---------------------------------------------------------------------------
// checkJs — type-check those .js files
// ---------------------------------------------------------------------------

// `allowJs: true` includes .js files but doesn't type-check them.
// `checkJs: true` enables type-checking on every included .js file.
//
// In practice, `checkJs: true` is heavy for an existing JS codebase — it
// surfaces every JSDoc gap at once. For incremental adoption, leave it off
// and use the per-file pragma below.

// ---------------------------------------------------------------------------
// // @ts-check — opt in or out per file
// ---------------------------------------------------------------------------

// A `// @ts-check` comment on the first line of a .js file forces TS to
// type-check just that file, regardless of `checkJs`. Conversely, `// @ts-nocheck`
// disables checking for a single file when `checkJs` is on.
//
// This is the workhorse for incremental migration — turn on checking one
// file at a time as you fix it up.

// ---------------------------------------------------------------------------
// Hover the imports below to see the difference
// ---------------------------------------------------------------------------

// tsconfig: `allowJs: true`, `checkJs: false`.

// From example.js — no JSDoc, no `// @ts-check` → params and return are `any`:
import { add } from './example.js';
//       ^? function add(a: any, b: any): any

// From checked.js — JSDoc + `// @ts-check` → fully typed:
import { multiply } from './checked.js';
//       ^? function multiply(a: number, b: number): number

// Calling `add` with anything goes — no error:
const sum = add('hello', 42);
//    ^? const sum: any

// Calling `multiply` is checked — wrong types error:

// @ts-expect-error
const product = multiply('hello', 42); // ❌ Argument of type 'string' is not assignable to 'number'.
//    ^? const product: number

console.log(sum, product);
