// =============================================================================
// noUncheckedSideEffectImports
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports

// A side-effect import runs a module for its side effects only — no bindings
// are imported:
//
//     import './styles.css';
//     import './polyfill';
//
// Without this flag, TS silently accepts side-effect imports even when the
// module can't be resolved. A typo in the path slips through type-checking
// and only fails at runtime (or in your bundler).
//
// With this flag, TS verifies the module resolves — typos and missing files
// become compile errors.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// @ts-expect-error
import './does-not-exist'; // ❌ Cannot find module './does-not-exist'.

// ---------------------------------------------------------------------------
// Fix
// ---------------------------------------------------------------------------

// Either remove the broken import, or fix the path / add the file.
// For non-code assets (CSS, images) without ambient declarations, you can
// add a `.d.ts` declaration so TS knows the module exists:
//
//   // assets.d.ts
//   declare module '*.css';
//
// Then `import './styles.css'` resolves through the wildcard declaration.

export {};
