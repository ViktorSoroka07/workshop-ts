// =============================================================================
// noUncheckedSideEffectImports
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports

// A side-effect import loads a module for what it does, and brings in no names:
//
//     import './theme.css';
//     import './polyfill';
//
// With this flag on, TypeScript checks that the path resolves, like any other import.
// With it off, it does not look: a typo in the path compiles, and fails when the
// bundler or the runtime reaches it.
//
// It is ON BY DEFAULT since TypeScript 6 (measured with an empty tsconfig on 6.0.2 and
// 7.0.2). This lesson's tsconfig writes it out; set it to `false` to see the old behaviour.
// Where files are found is ../../modules/07-moduleResolution/usage.ts.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// @ts-expect-error
import './polyfils'; // Error: Cannot find module or type declarations for side-effect import of './polyfils'.

// 🧪 Try it: set `"noUncheckedSideEffectImports": false` in this folder's tsconfig.json.
// `tsc` reports nothing for './polyfils' (and the `@ts-expect-error` above becomes
// unused). The import is a typo for a file that is not there.

// ---------------------------------------------------------------------------
// Non-code files
// ---------------------------------------------------------------------------

// `./theme.css` exists next to this file, and TypeScript still needs to be told what a
// `.css` import is, because it only knows how to read code. The wildcard declaration
// in assets.d.ts does that:
//
//   declare module '*.css';
import './theme.css'; // OK

// 🧪 Try it: remove the line from assets.d.ts. The import is reported (TS2882: "Cannot
// find module or type declarations for side-effect import of './theme.css'") even
// though the file exists.

// ✅ Best practice: keep the flag on and declare the asset types your bundler handles
// (`*.css`, `*.svg`, `*.png`) once, in one .d.ts file.

export {};
