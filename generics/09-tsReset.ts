// =============================================================================
// ts-reset: Fixing TypeScript's Built-in Types
// =============================================================================
// https://github.com/mattpocock/ts-reset

// TypeScript's own declarations (for `Array`, `JSON`, `Set`...) are written to be safe for
// every program, and a few of them are less helpful than they could be. The library
// `@total-typescript/ts-reset` replaces those with stricter, more useful ones.
//
// It is enabled by `import '@total-typescript/ts-reset'` in reset.d.ts, a declaration file
// that holds only types. That file sits in this folder, so everything compiled here has the
// patched types; other folders do not.
//
// ⚠️ Gotcha: the reset changes types globally. A project that adopts it gets the new behavior
// in every file, including code that relied on the old types.
//
// ✅ Best practice: adopt it at the start of a project. In an existing one, expect new errors
// wherever code relied on `any` from `JSON.parse` or `response.json()`. Lesson 10 uses the
// `unknown` it gives `response.json()`.
//
// 🧪 Try it: comment out the import in reset.d.ts. `scores` then hovers as
// `(number | null | undefined)[]` and `parsed` as `any`, the `@ts-expect-error` above
// `parsed.name` becomes "Unused '@ts-expect-error' directive", and `includes(role)` is rejected.

export {};

// --- filter(Boolean) narrows ---

const rawScores = [1, 2, null, undefined, 3];

// `Boolean` removes the empty values at runtime. Without the reset the type stays
// `(number | null | undefined)[]` and `const scores: number[] = rawScores.filter(Boolean)`
// is an error, Type '(number | null | undefined)[]' is not assignable to type 'number[]';
// with it, `filter(Boolean)` narrows:
const scores = rawScores.filter(Boolean); // type: number[]

console.log(scores); // [ 1, 2, 3 ]

// --- JSON.parse returns unknown ---

// Built-in `JSON.parse` returns `any`, which switches checking off (../types/08-anyUnknownNever.ts).
// The reset makes it `unknown`, so the result must be checked before use:
const parsed = JSON.parse('{"name":"Alice"}'); // type: unknown

// @ts-expect-error
parsed.name; // Error: 'parsed' is of type 'unknown'.

// The same applies to `response.json()` from `fetch`.

// --- includes accepts a wider type ---

const adminRoles = ['admin', 'owner'] as const;

function isAdminRole(role: string): boolean {
  // Without the reset, `role: string` is rejected because `includes` only accepts 'admin' | 'owner':
  // Error: Argument of type 'string' is not assignable to parameter of type '"admin" | "owner"'.
  return adminRoles.includes(role); // OK
}

console.log(isAdminRole('owner'), isAdminRole('guest')); // true false
