// =============================================================================
// allowUnreachableCode
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#allowUnreachableCode

// Three states:
//   undefined (default) — TS reports unreachable code as a warning
//   true                — silenced entirely (almost never what you want)
//   false               — promoted to a hard error
//
// This lesson sets it to `false` so unreachable code blocks the build.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

function earlyReturn(): string {
  return 'done';
  // @ts-expect-error
  console.log('never runs'); // ❌ Unreachable code detected.
}

function alwaysThrows(): never {
  throw new Error('boom');
  // @ts-expect-error
  console.log('also unreachable'); // ❌ Unreachable code detected.
}

// ---------------------------------------------------------------------------
// Common cause: bad refactor leaves dead code behind
// ---------------------------------------------------------------------------

function pickWinner(score: number): string {
  if (score > 100) {
    return 'gold';
  } else if (score > 50) {
    return 'silver';
  } else {
    return 'bronze';
  }
  // @ts-expect-error
  return 'unknown'; // ❌ leftover from a previous version — never reached
}

console.log(earlyReturn());
console.log(alwaysThrows);
console.log(pickWinner(75));
