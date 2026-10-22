// =============================================================================
// exactOptionalPropertyTypes
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes

// Distinguishes between "missing property" and "property set to undefined".
// Not part of `strict` — must be enabled separately.
//
// Note: requires `strictNullChecks` to be on (this lesson's tsconfig sets both).

// ---------------------------------------------------------------------------
// The difference
// ---------------------------------------------------------------------------

interface Settings {
  theme?: string; // optional — may be missing
}

// Without this flag, you can assign `undefined` to optional properties:
//   const s: Settings = { theme: undefined }; // ✅ allowed

// With this flag, `theme?: string` means "string or missing", NOT "string | undefined":

// @ts-expect-error
const broken: Settings = { theme: undefined }; // ❌ Type 'undefined' is not assignable

const valid1: Settings = {}; // ✅ property is missing
const valid2: Settings = { theme: 'dark' }; // ✅ property is present

// ---------------------------------------------------------------------------
// Why it matters
// ---------------------------------------------------------------------------

// Some APIs treat missing keys differently from keys set to undefined.
// For example, `Object.hasOwn` and serialization:

const a: Settings = {};
const b: Settings = { theme: undefined! }; // workaround to show the difference

console.log('theme' in a); // false — key doesn't exist
console.log('theme' in b); // true  — key exists (value is undefined)

console.log(JSON.stringify(a)); // {}
console.log(JSON.stringify(b)); // {} (undefined is stripped, but the intent was different)

// This flag makes TS enforce the distinction so your code matches the API's expectations.
