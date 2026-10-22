// =============================================================================
// The `strict` Flag
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strict
//
// The ✅ / ⚠️ / 🧪 / 🎓 markers, the `// Error:` comments and `@ts-expect-error` are explained in ../../intro/03-howToReadTheLessons.md.

// `strict` is one switch for a bundle of eight checks. Lessons 02-08 take them one
// at a time; this lesson shows the bundle and what is left outside it:
//
//   strict
//   ├─ strictNullChecks              null and undefined are types of their own        02
//   ├─ noImplicitAny                 a type TypeScript cannot infer is an error       03
//   ├─ strictPropertyInitialization  a class field must be set in the constructor     04
//   ├─ strictFunctionTypes           function parameters are checked contravariantly  05
//   ├─ strictBindCallApply           bind, call and apply check their arguments       06
//   ├─ noImplicitThis                `this` must have a known type                    07
//   ├─ useUnknownInCatchVariables    the caught value is `unknown`, not `any`         08
//   └─ alwaysStrict                  emit "use strict" in every output file
//
//   NOT in strict, each switched on by its own line (09-14):
//   noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitReturns,
//   noFallthroughCasesInSwitch, noUnusedLocals + noUnusedParameters, allowUnreachableCode
//
// `alwaysStrict` has nothing to show in a type error: it changes the emitted JavaScript
// (ES modules are strict anyway). Turning it off is deprecated in TypeScript 6.

// ---------------------------------------------------------------------------
// What `strict: true` reports
// ---------------------------------------------------------------------------

// This lesson's tsconfig sets `"strict": true`. Two of the eight flags are enough to see it work:

// @ts-expect-error
function applyTax(amount) {
  // Error: Parameter 'amount' implicitly has an 'any' type. -- noImplicitAny
  return amount * 1.2;
}

// @ts-expect-error
const customerName: string = null; // Error: Type 'null' is not assignable to type 'string'. -- strictNullChecks

// ---------------------------------------------------------------------------
// Switching one flag off inside `strict`
// ---------------------------------------------------------------------------

// A flag named next to `strict` wins, whatever the order:
//
//   { "compilerOptions": { "strict": true, "strictPropertyInitialization": false } }
//
// Everything else stays on. That is the way to adopt `strict` on an old codebase:
// switch on the bundle, switch off the flags whose errors you cannot fix yet, and
// remove those lines one at a time.

// ---------------------------------------------------------------------------
// `strict` is the default
// ---------------------------------------------------------------------------

// Since TypeScript 6.0, a tsconfig that says nothing about `strict` already has it on
// (measured with an empty tsconfig on 6.0.2 and 7.0.2: both report TS7006 for
// `function f(x)` and TS2322 for `const s: string = null`).
//
// This workshop's `tsconfig.base.json` writes `"strict": false` on purpose, so that
// each of the next lessons switches on exactly one flag and the error you see is
// that flag's.

// ⚠️ Gotcha: a tsconfig written for TypeScript 5 without a `strict` line was loose.
// The same file on TypeScript 6 is strict, and a project that compiled yesterday fails
// after the upgrade. Set `"strict": false`, or the individual flags off, while you migrate.

// ✅ Best practice: keep `"strict": true` written out even though it is the default:
// it states the intent, and the same file stays strict under TypeScript 5. The
// documentation says `strict` may gain checks in later releases, so an upgrade can
// bring new errors; they are the price of the safety.

// 🧪 Try it: delete the `"strict": true` line from this folder's tsconfig.json. The base
// config's `false` takes over and both `@ts-expect-error` lines report "Unused '@ts-expect-error'
// directive". Delete `strict` from a copy of the base config as well and the errors are back.

export { applyTax, customerName };
