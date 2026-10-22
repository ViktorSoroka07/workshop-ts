// =============================================================================
// Options removed in TypeScript 7
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-7-0.html

// TypeScript 7 is the same checker ported to Go. The type system did not change:
// lessons 01-19 mean the same thing on both. What changes is the configuration. Options
// that TypeScript 6 DEPRECATES are REMOVED in 7.
//
// This lesson is a reference, not an exercise. Every row was measured by putting the
// option alone in a tsconfig and running tsc 6.0.2 and tsc 7.0.2.

// ---------------------------------------------------------------------------
// Two kinds of error
// ---------------------------------------------------------------------------

// TypeScript 6, deprecated: the option still works. tsc reports it as an error
//   TS5107 (TS5101 for downlevelIteration, baseUrl, outFile) and says how to silence it:
//   "ignoreDeprecations": "6.0"
//
// TypeScript 7, removed: tsc reports TS5108 (TS5102 for the same three) and the option
//   does nothing. `ignoreDeprecations` does not silence it.

// ---------------------------------------------------------------------------
// The options
// ---------------------------------------------------------------------------

//   in tsconfig.json                 TS 6                      TS 7              use instead
//   ------------------------------   -----------------------   ---------------   ----------------------------------------
//   "target": "es5"                  TS5107                    TS5108            ES2015 or later ("es3" is already TS5108 in 6)
//   "downlevelIteration": true       TS5101                    TS5102            nothing: ES2015+ iterates natively
//   "module": "amd" | "umd" |        TS5107                    TS5108            "esnext", "preserve" or "commonjs"
//     "system"
//   "module": "none"                 TS5107                    TS6046 (it is     as above
//                                                              not a valid value)
//   "moduleResolution": "node" |     TS5107 (printed as        TS5108            "bundler" or "nodenext"
//     "node10"                       'node10')
//   "moduleResolution": "classic"    TS5107                    TS5108            "bundler" or "nodenext"
//   "baseUrl": "."                   TS5101                    TS5102 + hint     put the prefix into "paths"
//   "outFile": "bundle.js"           TS5101                    TS5102            a bundler
//   "esModuleInterop": false         TS5107                    TS5108            leave it on (the only mode now)
//   "allowSyntheticDefaultImports":  TS5107                    TS5108            leave it on
//     false
//   "alwaysStrict": false            TS5107                    TS5108            leave it on
//
// `baseUrl` in TypeScript 7 prints a hint with the replacement:
//   error TS5102: Option 'baseUrl' has been removed. Please remove it from your configuration.
//     Use '"paths": {"*": ["./*"]}' instead.
// The `paths` targets then need the leading "./" (TS5090: "Non-relative paths are not
// allowed. Did you forget a leading './'?"). Path aliases themselves: ../../modules/06-pathAliases/usage.ts.
//
// `outFile` is what ../../namespaces/05-referencePaths.ts builds with. The root of this
// repository stays on TypeScript 6 for that reason, and silences the deprecation with
// "ignoreDeprecations": "6.0" in namespaces/tsconfig.outfile.json.

// ---------------------------------------------------------------------------
// Syntax that is an error on both
// ---------------------------------------------------------------------------

// The `module` keyword for a namespace is an error in TypeScript 6 and in 7.
// ../../namespaces/01-namespaceBasics.ts has the `namespace` spelling.

// @ts-expect-error
module Legacy {
  // Error: A 'namespace' declaration should not be declared using the 'module' keyword. Please use the 'namespace' keyword instead.
  export const version = 1;
}

// ---------------------------------------------------------------------------
// Defaults, measured on 6.0.2 and 7.0.2
// ---------------------------------------------------------------------------

//   strict                          on when not set (lesson 01)
//   noUncheckedSideEffectImports    on when not set (lesson 17)
//   moduleResolution                "bundler" when not set. An unset value depended on "module"
//                                   in TypeScript 5 and could be "classic" or "node10", both removed.
//
// ⚠️ Gotcha: a config that relied on the old default for `moduleResolution` may resolve
// packages differently after an upgrade. Write the value out.

// ---------------------------------------------------------------------------
// What is not ready yet
// ---------------------------------------------------------------------------

// - TypeScript 7.0 ships no programmatic API; it is planned for 7.1. A tool that
//   imports `typescript` and walks the syntax tree has to wait.
// - typescript-eslint (8.72.0, the latest when this was written) declares the peer
//   `typescript: ">=4.8.4 <6.1.0"`. A project that lints with it cannot move to 7
//   without breaking `npm run lint`. That is why this repository pins TypeScript 6.
//   The `native-compiler` branch runs on 7 and has no eslint.

// 🧪 Try it: add `"target": "es5"` to this folder's tsconfig.json and run
// `npx tsc -p flags/20-removed-in-typescript-7`. TypeScript 6 stops with TS5107. Add
// `"ignoreDeprecations": "6.0"` and it passes. Run the same folder with
// `npx -p typescript@7 tsc -p flags/20-removed-in-typescript-7`: TS5108, whatever you add.

export { Legacy };
