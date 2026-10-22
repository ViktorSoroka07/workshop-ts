// =============================================================================
// What `satisfies` Checks
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
//
// `value satisfies Type` checks that the value fits the type, then throws the type away:
// the variable keeps the type TypeScript inferred from the value itself.
// Annotations and inference are covered in ../types/01-primitives.ts and
// ../types/07-avoidingRedundantAnnotations.ts, `as` in ../types/13-assertionsAndAsConst.ts.
//
// The ✅ / ⚠️ / 🧪 / 🎓 markers in these files are explained in ../types/01-primitives.ts.

import type { AppConfig } from './AppConfig';

// --- Inference alone has no shape to check against ---
// Every line compiles, including a typo and a value of the wrong kind; the inferred type
// is whatever was written: { red: number[]; green: number; bleu: number[] }.
const brokenPalette = {
  red: [255, 0, 0],
  green: 255, // should be a hex string
  bleu: [0, 0, 255], // typo for `blue`
};

// --- `satisfies` supplies the expected shape ---
type ColorName = 'red' | 'green' | 'blue';
type Rgb = [red: number, green: number, blue: number];
type Palette = Record<ColorName, string | Rgb>;

const typoPalette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
  // @ts-expect-error
  bleu: [0, 0, 255], // Error: Object literal may only specify known properties, and 'bleu' does not exist in type 'Palette'.
} satisfies Palette;

const missingPalette = {
  red: [255, 0, 0],
  green: '#00ff00',
  // @ts-expect-error
} satisfies Palette; // Error: Type '{ red: [number, number, number]; green: string; }' does not satisfy the expected type 'Palette'.

const longPalette = {
  red: [255, 0, 0],
  green: '#00ff00',
  // @ts-expect-error
  blue: [0, 0, 255, 0], // Error: Type '[number, number, number, number]' is not assignable to type 'string | Rgb'.
} satisfies Palette;

// --- A valid value keeps its narrow type ---
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Palette;

palette.red; // type: [number, number, number] -- the tuple, not `string | Rgb`
palette.green; // type: string

palette.green.toUpperCase(); // OK -- a `string | Rgb` could not offer this
palette.red.map((channel) => channel / 255); // OK -- already known to be a tuple

// --- The same check for an object with nested settings ---
const config = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
} satisfies AppConfig;

config.apiUrl.port; // type: number

// 🧪 Try it: add `debugMode: true` or delete `retryCount` above and read the error.
