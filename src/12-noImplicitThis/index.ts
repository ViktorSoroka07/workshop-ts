// =============================================================================
// noImplicitThis (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitThis

// Errors when `this` has an implied `any` type — typically inside a regular
// (non-arrow) function where TS can't determine what `this` refers to.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// A regular function inside a method loses the `this` context:

class ButtonBroken {
  label = 'Click me';

  getHandler() {
    return function () {
      // @ts-expect-error
      console.log(this.label); // ❌ 'this' implicitly has type 'any'
    };
  }
}

// ---------------------------------------------------------------------------
// Fix 1: arrow function (captures `this` from surrounding scope)
// ---------------------------------------------------------------------------

class Button {
  label = 'Click me';

  getHandler() {
    return () => {
      console.log(this.label); // ✅ `this` is Button
    };
  }
}

// ---------------------------------------------------------------------------
// Fix 2: explicit `this` parameter
// ---------------------------------------------------------------------------

// You can declare what `this` should be — TS uses it for type-checking
// without emitting it at runtime:

function describe(this: { name: string }) {
  return `Hello, ${this.name}`;
}

describe.call({ name: 'Alice' }); // ✅

// @ts-expect-error
describe.call({ age: 30 }); // ❌ missing `name`

console.log(ButtonBroken, Button);
