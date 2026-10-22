// =============================================================================
// JS interop: allowJs, checkJs, // @ts-check
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#allowJs
// https://www.typescriptlang.org/tsconfig/#checkJs

// Three settings decide how TypeScript treats the .js files of a project. They are
// project setup, not checks on your TypeScript: none of them is part of `strict`, and
// all three are off by default. This lesson's tsconfig sets `allowJs: true`, `checkJs: false`.

// ---------------------------------------------------------------------------
// allowJs -- bring .js files into the project
// ---------------------------------------------------------------------------

// Without `allowJs`, TypeScript does not read .js files. With it, they are part of the
// program: .ts files can import them, and their types come from the code and from
// JSDoc comments.
//
// Use it when:
//   - migrating a JavaScript codebase to TypeScript one file at a time
//   - the project mixes TypeScript with JavaScript you keep (build scripts, legacy code)

// ---------------------------------------------------------------------------
// checkJs -- report errors inside those .js files
// ---------------------------------------------------------------------------

// `allowJs` alone reads the .js files but reports nothing in them. `checkJs: true` checks
// every included .js file at once, which on an existing codebase means every gap in its
// JSDoc at once.

// ---------------------------------------------------------------------------
// // @ts-check -- one file at a time
// ---------------------------------------------------------------------------

// A `// @ts-check` comment on the first line of a .js file checks that file whatever
// `checkJs` says. The opposite, `// @ts-nocheck`, turns the check off for one file when
// `checkJs` is on.

// ✅ Best practice: for a gradual migration leave `checkJs` off, add `// @ts-check` to
// each file as you give it JSDoc types, and turn `checkJs` on when the last file is done.

// ---------------------------------------------------------------------------
// What each file gives you
// ---------------------------------------------------------------------------

// From example.js -- no JSDoc and no pragma, so parameters and result are `any`:
import { add } from './example.js';
//       ^? function add(first: any, second: any): any

// From checked.js -- JSDoc and `// @ts-check`, so the types are real:
import { multiply } from './checked.js';
//       ^? function multiply(first: number, second: number): number

// Any call to `add` compiles:
const sum = add('hello', 42);
//    ^? const sum: any

// A call to `multiply` is checked against its JSDoc:

// @ts-expect-error
const product = multiply('hello', 42); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
//    ^? const product: number

console.log(sum, product);

// 🧪 Try it: set `"checkJs": true` in this folder's tsconfig.json. example.js now reports
// the misspelled method in `bannerText` (TS2551: "Property 'toUpperCas' does not exist on
// type '"welcome"'"). The `add('not a number', 5)` call still passes: its parameters
// are `any`, and `any` accepts everything. Types in the JSDoc are what make checking useful.
