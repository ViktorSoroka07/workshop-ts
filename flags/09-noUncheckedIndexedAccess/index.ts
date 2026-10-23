// =============================================================================
// noUncheckedIndexedAccess
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess

// Adds `undefined` to the type of a value read by an index that TypeScript cannot
// check. NOT part of `strict`: switch it on separately.
//
// Needs `strictNullChecks` (02), because `undefined` has to be a type of its own.
// This lesson's tsconfig sets both.
//
// It closes the blind spot shown in ../../types/05-indexSignatures.ts: a key that
// is not there still has the declared type.

// ---------------------------------------------------------------------------
// Arrays
// ---------------------------------------------------------------------------

const colors = ['red', 'green', 'blue'];

// Without the flag, `colors[10]` is `string`: TypeScript assumes the index exists.
// With the flag it is `string | undefined`.

const color = colors[10];
// type: string | undefined

// @ts-expect-error
console.log(color.toUpperCase()); // Error: 'color' is possibly 'undefined'.

// Check first (narrowing: ../../types/10-narrowing.ts):
if (color !== undefined) {
  console.log(color.toUpperCase());
}

// ---------------------------------------------------------------------------
// Objects with an index signature
// ---------------------------------------------------------------------------

type ScoreBoard = {
  [subject: string]: number;
};

const scores: ScoreBoard = { math: 95, english: 88 };

const science = scores['science'];
// type: number | undefined

// @ts-expect-error
console.log(science.toFixed()); // Error: 'science' is possibly 'undefined'.

// An object type with named keys is not affected, only the index signature is:
const knownScores = { math: 95, english: 88 };
console.log(knownScores.math.toFixed()); // 95

// The flag fits data from outside (API responses, config files, user input), where
// nobody guarantees which keys exist.

// ---------------------------------------------------------------------------
// Where it also applies
// ---------------------------------------------------------------------------

// The index in a counting loop is unchecked, so each element is `string | undefined`:
for (let position = 0; position < colors.length; position++) {
  // @ts-expect-error
  console.log(colors[position].toUpperCase()); // Error: Object is possibly 'undefined'.
}

// Array destructuring reads by index too:
const [firstColor] = colors;
// type: string | undefined

// ⚠️ Gotcha: the check cannot see that `position < colors.length` made the index valid.
// ✅ Best practice: loop with `for…of`, `forEach` or `map`, which hand you the elements
// themselves, typed without `undefined`:
for (const name of colors) {
  console.log(name.toUpperCase());
}

// A tuple (../../types/03-objectArraysTuples.ts) knows its length, so its positions
// are not `undefined`:
const rgb: [number, number, number] = [255, 128, 0];
console.log(rgb[0].toFixed()); // 255

console.log(firstColor);
