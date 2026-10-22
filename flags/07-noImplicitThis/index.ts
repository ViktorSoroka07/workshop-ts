// =============================================================================
// noImplicitThis (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitThis

// Errors when `this` has an implicit `any` type: inside a regular (non-arrow)
// function where TypeScript cannot tell what `this` will be at the call.
//
// How `this` gets lost, and the four ways to keep it in a class (arrow function,
// `bind`, a closure variable, an arrow field), is ../../classes/13-losingThis.ts.
// This lesson is about the flag and the one fix that belongs to it: declaring `this`.
//
// This lesson's tsconfig also sets `strictBindCallApply` (06): the `.call` check at the
// end of the file needs it.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

class ButtonBroken {
  label = 'Click me';

  getHandler() {
    return function () {
      // @ts-expect-error
      console.log(this.label); // Error: 'this' implicitly has type 'any' because it does not have a type annotation.
    };
  }
}

// Inside an object literal, the flag types `this` as the literal itself, so this one
// is fine; without the flag `this` there is `any`:
const counter = {
  count: 0,
  increment() {
    this.count++;
    return this.count;
  },
};

console.log(counter.increment()); // 1

// ---------------------------------------------------------------------------
// The fix the flag adds: a `this` parameter
// ---------------------------------------------------------------------------

// A function can declare what `this` must be. The declaration is only for the
// compiler: it is erased and is not a real parameter.
function describeUser(this: { name: string }) {
  return `Hello, ${this.name}`;
}

console.log(describeUser.call({ name: 'Alice' })); // Hello, Alice

// A call with no object to be `this` is refused:

// @ts-expect-error
describeUser(); // Error: The 'this' context of type 'void' is not assignable to method's 'this' of type '{ name: string; }'.

// And so is an object of the wrong shape:
const visitor = { age: 30 };

// @ts-expect-error
describeUser.call(visitor); // Error: Argument of type '{ age: number; }' is not assignable to parameter of type '{ name: string; }'.

console.log(ButtonBroken);

// ✅ Best practice: in a class, prefer an arrow function so there is no `this` to
// declare; use a `this` parameter on standalone functions that are meant to be
// called with `.call` or attached to an object.
