import { Config } from './Config';

// =============================================================================
// Implicit Type Inference vs `satisfies`
// =============================================================================

// ---------------------------------------------------------------------------
// How implicit inference works
// ---------------------------------------------------------------------------

// TypeScript infers types from the values you assign.
// You get type safety without writing a single type annotation:

const config = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
};

// Hover over `config` — TS inferred:
//   { apiUrl: { host: string; port: number }; retryCount: number }

config.apiUrl.host; // string — autocomplete works
config.retryCount;  // number

// TS also protects against unknown properties:
// @ts-expect-error
config.debugMode = true; // ❌ Error — property doesn't exist on the inferred type

// Another example — each key gets its own specific type:

const palette1 = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
};

palette1.red;   // type: number[]  — .forEach, .map exist
palette1.green; // type: string    — .toUpperCase exists

// ---------------------------------------------------------------------------
// The problem: inference alone can't catch shape mistakes
// ---------------------------------------------------------------------------

// TS infers whatever you give it — it has no "expected shape" to check against.
// Typos in keys and wrong value types go unnoticed:

const brokenConfig = {
  apiUrl: { host: '/api', port: 8080 },
  retrycount: 3, // typo: should be `retryCount` — TS doesn't know
  debugMode: true, // extra property — TS doesn't know it shouldn't be here
};

const brokenPalette = {
  red: [255, 0, 0],
  green: 255,         // wrong type — should be string or RGB tuple
  bleu: [0, 0, 255],  // typo — should be `blue`
};

// Both compile fine. TS trusts whatever you write because there's no target type.

// ---------------------------------------------------------------------------
// `satisfies` — validate the shape, keep the narrow type
// ---------------------------------------------------------------------------

// `satisfies` checks that your value matches a type WITHOUT widening the variable.
// You get validation + narrow inference at the same time.

// First, define what we expect:
type Colors = 'red' | 'green' | 'blue';
type RGB = [red: number, green: number, blue: number];

// Now TS catches typos and wrong value types:

const palette3 = {
  red: [255, 0, 0],
  green: '#00ff00',
  // @ts-expect-error
  bleu: [0, 0, 255], // ❌ Error — 'bleu' is not in Colors
} satisfies Record<Colors, string | RGB>;

const palette4 = {
  // @ts-expect-error
  blue: [0, 0, 255, 0], // ❌ Error — tuple expects exactly 3 elements
} satisfies Record<Colors, string | RGB>;

// With a valid value, the inferred type is still narrow — not widened to the target:

const validPalette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Record<Colors, string | RGB>;

validPalette.red;   // type: [number, number, number] — NOT string | RGB
validPalette.green; // type: string — NOT string | RGB

// Compare: without `satisfies`, `red` would be `number[]` (less precise).
// With `satisfies`, it's `[number, number, number]` (exact tuple).

// Same idea with Config — catch extra/missing properties:

const validConfig = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
} satisfies Config;

const configWithExtra = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  // @ts-expect-error
  debugMode: true, // ❌ Error — not in Config
} satisfies Config;
