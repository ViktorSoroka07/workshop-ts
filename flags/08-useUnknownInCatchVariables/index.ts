// =============================================================================
// useUnknownInCatchVariables (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables

// The variable in `catch (error)` is `unknown` instead of `any`, so you must find out
// what was thrown before you use it. `unknown` itself is introduced in
// ../../types/08-anyUnknownNever.ts.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// JavaScript lets you `throw` any value: an Error, a string, a plain object.
// `catch` cannot know which, and `any` (the setting without the flag) lets every
// property access through:

try {
  throw 'connection lost';
} catch (error) {
  // @ts-expect-error
  console.log(error.message); // Error: Property 'message' does not exist on type 'unknown'.
}

// Without the flag `error.message` compiles above and prints `undefined`: the thrown value is a string.

// ---------------------------------------------------------------------------
// Narrowing first
// ---------------------------------------------------------------------------

// `instanceof` and `typeof` checks (../../types/10-narrowing.ts) turn `unknown` into a
// type you can use. Put them in one helper, so every `catch` reads the same:
function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return JSON.stringify(error);
}

try {
  throw new Error('disk full');
} catch (error) {
  console.log(describeError(error)); // disk full
}

try {
  throw { code: 404 };
} catch (error) {
  console.log(describeError(error)); // {"code":404}
}

// ---------------------------------------------------------------------------
// Annotating the catch variable
// ---------------------------------------------------------------------------

// Only `unknown` and `any` are accepted. A more specific type would be a claim
// about what was thrown that nothing checks:

try {
  throw new Error('disk full');
  // @ts-expect-error
} catch (error: Error) {
  // Error: Catch clause variable type annotation must be 'any' or 'unknown' if specified.
  console.log(error.message);
}

// `any` is allowed, and it switches the check back off for that block:
try {
  throw 'connection lost';
} catch (error: any) {
  console.log(error.message); // OK -- and prints undefined, the thrown value is a string
}

// ✅ Best practice: leave the variable alone and narrow it.
