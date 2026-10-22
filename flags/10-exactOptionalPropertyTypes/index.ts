// =============================================================================
// exactOptionalPropertyTypes
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes

// Separates "the property is missing" from "the property is there and holds
// `undefined`". NOT part of `strict`: switch it on separately.
//
// Needs `strictNullChecks` (02), because `undefined` has to be a type of its own.
// This lesson's tsconfig sets both.

// ---------------------------------------------------------------------------
// The difference
// ---------------------------------------------------------------------------

type Settings = {
  theme?: string; // may be missing
};

// Without the flag, `theme?: string` means `string | undefined`, and this compiles:
//   const userSettings: Settings = { theme: undefined };
// With the flag it means "a string, or no `theme` key at all":

// @ts-expect-error
const userSettings: Settings = { theme: undefined }; // Error: Type '{ theme: undefined; }' is not assignable to type 'Settings' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.

const emptySettings: Settings = {}; // OK -- the key is missing
const darkSettings: Settings = { theme: 'dark' }; // OK -- the key is there

// Assigning `undefined` to the property later is refused the same way:
function clearTheme(settings: Settings) {
  // @ts-expect-error
  settings.theme = undefined; // Error: Type 'undefined' is not assignable to type 'string' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the type of the target.
}

// ---------------------------------------------------------------------------
// Why it matters
// ---------------------------------------------------------------------------

// A missing key and a key holding `undefined` behave differently at runtime.
// Merging user settings over defaults is the usual place:
const defaults: Settings = { theme: 'dark' };

// If the override may hold `undefined` on purpose, the type has to say so:
type SettingsOverride = {
  theme?: string | undefined;
};

const noOverride: SettingsOverride = {};
const unsetOverride: SettingsOverride = { theme: undefined }; // OK -- spelled out

console.log({ ...defaults, ...noOverride }); // { theme: 'dark' }
console.log({ ...defaults, ...unsetOverride }); // { theme: undefined } -- the default is wiped

console.log('theme' in noOverride); // false
console.log('theme' in unsetOverride); // true

console.log(JSON.stringify(unsetOverride)); // {} -- JSON drops the key, so the difference disappears there

// ✅ Best practice: write `theme?: string` when the key is simply optional, and
// `theme?: string | undefined` only where holding `undefined` is a meaningful state.
// The flag makes you choose, instead of every optional property allowing both.

console.log(userSettings, emptySettings, darkSettings, clearTheme);
