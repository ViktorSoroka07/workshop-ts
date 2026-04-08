// `/// <reference path="..." />` is how namespace files declare dependencies.
// There are no import/export statements — everything is global.
//
// In this project, these directives are redundant because tsconfig's `"include": ["src"]`
// already picks up all files. But they become essential when using `outFile` to concatenate
// namespaces into a single JS bundle — without them, TS can't find the referenced files.
//
// Try it: run `npm run build:outfile` (uses tsconfig.outfile.json with `outFile`).
// Then remove the `/// <reference>` lines below and run it again —
// you'll get: "Cannot find namespace 'Validation'".
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

let strings = ['Hello', '98052', '101'];

let validators: { [s: string]: Validation.StringValidator } = {};
validators['ZIP code'] = new Validation.ZipCodeValidator();
validators['Letters only'] = new Validation.LettersOnlyValidator();

for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? 'matches' : 'does not match'
      } ${name}`
    );
  }
}

// @ts-expect-error
Validation.verify; // ❌ Error — `verify` is not exported in Validation.ts

// ---------------------------------------------------------------------------
// Why modules replaced namespaces
// ---------------------------------------------------------------------------
// - Namespaces pollute the global scope and can cause naming conflicts.
// - No tree-shaking, no code splitting, no lazy loading.
// - Incompatible with modern bundlers (Vite, webpack, esbuild).
// - TypeScript-specific — not part of JavaScript.
//
// Use ES modules for all new code.
