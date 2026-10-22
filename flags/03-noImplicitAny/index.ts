// =============================================================================
// noImplicitAny (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitAny

// Raises an error when TypeScript cannot infer a type and falls back to `any`.
// Without the flag, untyped code compiles and gives you no type safety.
// `any` itself (../../types/08-anyUnknownNever.ts) is still allowed when you write it.

// ---------------------------------------------------------------------------
// Untyped function parameters
// ---------------------------------------------------------------------------

// @ts-expect-error
function applyDiscount(price, percent) {
  // Error: Parameter 'price' implicitly has an 'any' type. -- and the same for 'percent'
  return price - price * percent;
}

// Fix: write the types
function applyDiscountTyped(price: number, percent: number) {
  return price - price * percent;
}

// ---------------------------------------------------------------------------
// Untyped callbacks
// ---------------------------------------------------------------------------

// Where the context gives a type, nothing is missing: `map` knows its element type.
const labels = [1, 2, 3].map((item) => item.toFixed(1)); // OK -- `item` is `number`
console.log(labels); // [ '1.0', '2.0', '3.0' ]

// A parameter with no context gets `any`:

// @ts-expect-error
function runTask(callback) {
  // Error: Parameter 'callback' implicitly has an 'any' type.
  callback();
}

// Fix: type the callback
function runTaskTyped(callback: () => void) {
  callback();
}

// ---------------------------------------------------------------------------
// Writing `any` yourself is allowed
// ---------------------------------------------------------------------------

// The flag stops the quiet fallback, not the choice. `any` written out is visible in
// review and can be searched for:
function readLegacyField(data: any) {
  return data.whatever;
}

// ⚠️ Gotcha: the flag polices *implicit* `any` only. An `any` that a library declares
// reaches your code without any error:
const settings = JSON.parse('{ "theme": "dark" }');
// type: any -- declared by `JSON.parse`, so nothing is reported

console.log(settings.theme.toUpperCase()); // DARK -- and so does a typo like `settings.thme`

// ✅ Best practice: give the result a type on the spot (`const settings: Settings = …`) or
// call it `unknown` and narrow it.

console.log(applyDiscountTyped(80, 0.25), runTaskTyped, readLegacyField); // 60
