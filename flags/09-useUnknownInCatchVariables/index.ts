// =============================================================================
// useUnknownInCatchVariables (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables

// Catch variables are `unknown` instead of `any`, forcing you to check the type
// before using the value.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

try {
  throw new Error('oops');
} catch (err) {
  // err is `unknown` — must narrow before using:

  // @ts-expect-error
  console.log(err.message); // ❌ 'err' is of type 'unknown'

  if (err instanceof Error) {
    console.log(err.message); // ✅ safe — narrowed to Error
  }
}

// ---------------------------------------------------------------------------
// Why it matters
// ---------------------------------------------------------------------------

// JavaScript lets you `throw` anything — strings, numbers, objects, etc.
// Treating the catch variable as `any` (the old default) silently allowed
// unsafe access. `unknown` forces you to acknowledge that you don't know
// what was thrown and handle it explicitly.

function safeStringify(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return JSON.stringify(err);
}

try {
  throw 'string error';
} catch (err) {
  console.log(safeStringify(err));
}
