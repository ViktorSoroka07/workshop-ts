// =============================================================================
// noUncheckedIndexedAccess
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess

// Adds `undefined` to the type when accessing arrays or objects by index.
// Not part of `strict` — must be enabled separately.

// ---------------------------------------------------------------------------
// Arrays
// ---------------------------------------------------------------------------

const colors = ['red', 'green', 'blue'];

// Without this flag: colors[10] is `string` — TS assumes the index is valid.
// With this flag:    colors[10] is `string | undefined` — TS forces a check.

const color = colors[10];
//    ^? const color: string | undefined

// @ts-expect-error
console.log(color.toUpperCase()); // ❌ 'color' is possibly 'undefined'

// Fix: check first
if (color) {
  console.log(color.toUpperCase()); // ✅
}

// ---------------------------------------------------------------------------
// Objects with index signatures
// ---------------------------------------------------------------------------

const scores: Record<string, number> = { math: 95, english: 88 };

const science = scores['science'];
//    ^? const science: number | undefined

// @ts-expect-error
console.log(science.toFixed()); // ❌ 'science' is possibly 'undefined'

// This flag is especially useful for data from external sources (API responses,
// config files) where you can't guarantee which keys exist.
