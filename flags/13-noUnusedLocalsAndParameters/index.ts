// =============================================================================
// noUnusedLocals + noUnusedParameters
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noUnusedLocals
// https://www.typescriptlang.org/tsconfig/#noUnusedParameters

// Two related flags that report code which is declared and never read. NOT part of
// `strict`: switch them on separately. They catch what is left behind by a change
// of mind: a variable no longer needed, an import after the line that used it was deleted.

export {};

// ---------------------------------------------------------------------------
// noUnusedLocals -- variables, functions and imports that are never read
// ---------------------------------------------------------------------------

// @ts-expect-error
const taxRate = 0.2; // Error: 'taxRate' is declared but its value is never read.

// Fix: use it, or delete the declaration.
const shippingFee = 5;
console.log(shippingFee);

// Unused imports are reported the same way, which is how this flag keeps import lists clean:
//   import { readFileSync } from 'node:fs';
//   Error: 'readFileSync' is declared but its value is never read.

// ⚠️ Gotcha: the underscore prefix does NOT silence `noUnusedLocals`. Only a few
// places honour it (destructuring elements, `for…of` variables, parameters):
// @ts-expect-error
const _internalCode = 42; // Error: '_internalCode' is declared but its value is never read.

const [_first, second] = ['a', 'b'];
console.log(second); // b -- `_first` is fine

// ---------------------------------------------------------------------------
// noUnusedParameters -- function parameters that are never read
// ---------------------------------------------------------------------------

// @ts-expect-error
function formatPrice(amount: number, currency: string) {
  // Error: 'currency' is declared but its value is never read.
  return `${amount}`;
}

// Fix 1: prefix with `_` -- "I know it is there and I am ignoring it"
function formatPriceIgnoreCurrency(amount: number, _currency: string) {
  return `${amount}`;
}

// Fix 2: remove the parameter (the usual answer when you own the signature)
function formatPriceSimple(amount: number) {
  return `${amount}`;
}

console.log(formatPrice(5, 'EUR'));
console.log(formatPriceIgnoreCurrency(5, 'EUR'));
console.log(formatPriceSimple(5));

// ---------------------------------------------------------------------------
// Why the underscore matters for callbacks
// ---------------------------------------------------------------------------

// A callback has a fixed signature you cannot change, and you may need only its
// first argument. A parameter before one you do use must stay, and `_` marks it:
['a', 'b'].forEach((_item, index) => {
  console.log(index); // 0, then 1
});

// ✅ Best practice: lint rules such as `@typescript-eslint/no-unused-vars` report the
// same thing with more options (ignore by pattern, ignore the rest sibling of a
// destructuring). Pick one tool for it; the compiler flag is the zero-setup choice.
