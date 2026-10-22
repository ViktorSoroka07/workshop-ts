// =============================================================================
// strictBindCallApply (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strictBindCallApply

// Type-checks the arguments passed to `.bind()`, `.call()`, and `.apply()`.
// Without this flag, these methods accept any arguments — silently allowing
// runtime errors.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

function greet(name: string, age: number) {
  return `Hello ${name}, you are ${age}`;
}

greet.call(null, 'Alice', 30); // ✅

// @ts-expect-error
greet.call(null, 'Alice'); // ❌ Expected 2 arguments, but got 1

// @ts-expect-error
greet.call(null, 'Alice', '30'); // ❌ Argument of type 'string' is not assignable to 'number'

// ---------------------------------------------------------------------------
// .bind() is also checked
// ---------------------------------------------------------------------------

const partial = greet.bind(null, 'Alice'); // ✅ partial application

partial(30); // ✅

// @ts-expect-error
partial('30'); // ❌ Argument of type 'string' is not assignable to 'number'
