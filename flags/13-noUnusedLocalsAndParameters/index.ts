// =============================================================================
// noUnusedLocals + noUnusedParameters
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noUnusedLocals
// https://www.typescriptlang.org/tsconfig/#noUnusedParameters

// Two related flags. Catch dead code that adds noise and hides intent.

export {};

// ---------------------------------------------------------------------------
// noUnusedLocals — declared but never read
// ---------------------------------------------------------------------------

// @ts-expect-error
const unusedLocal = 42; // ❌ 'unusedLocal' is declared but its value is never read.

// Fix: use it, or remove the declaration entirely.
const used = 42;
console.log(used);

// Note: the underscore-prefix convention does NOT bypass `noUnusedLocals` —
// only `noUnusedParameters` honors it (see below).

// ---------------------------------------------------------------------------
// noUnusedParameters — function param declared but never read
// ---------------------------------------------------------------------------

// @ts-expect-error
function greet(name: string, age: number) {
  // ❌ 'age' is declared but its value is never read.
  return `Hi ${name}`;
}

// Fix 1: prefix with `_` — TS treats it as an intentional placeholder
function greetIgnoreAge(name: string, _age: number) {
  return `Hi ${name}`;
}

// Fix 2: remove the parameter (often the right answer if a callback signature allows it)
function greetSimple(name: string) {
  return `Hi ${name}`;
}

console.log(greet('Bob', 30));
console.log(greetIgnoreAge('Sue', 30));
console.log(greetSimple('Tim'));

// ---------------------------------------------------------------------------
// Why the underscore matters for callbacks
// ---------------------------------------------------------------------------

// Some callbacks have a fixed signature you can't change — but you only need
// the first argument. The `_` prefix says "yes, I know it's there; I'm
// intentionally ignoring it."

[1, 2, 3].forEach((value, _index, _array) => {
  console.log(value);
});
