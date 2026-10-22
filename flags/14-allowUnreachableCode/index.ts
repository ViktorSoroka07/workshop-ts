// =============================================================================
// allowUnreachableCode
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#allowUnreachableCode

// Statements that can never run: code after a `return` or `throw`, or after a branch
// that has already returned. The option has three states:
//
//   not set (default)  the editor greys the code out; `tsc` reports nothing and the build passes
//   true               no hint at all
//   false              a compile error
//
// NOT part of `strict`. This lesson sets `false`, so dead code breaks the build.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

function earlyReturn(): string {
  return 'done';
  // @ts-expect-error
  console.log('never runs'); // Error: Unreachable code detected.
}

function alwaysThrows(): never {
  throw new Error('boom');
  // @ts-expect-error
  console.log('also unreachable'); // Error: Unreachable code detected.
}

// ---------------------------------------------------------------------------
// Dead code left behind by an edit
// ---------------------------------------------------------------------------

// Once every branch of an `if` returns, whatever follows the `if` is dead:
function pickWinner(score: number): string {
  if (score > 100) {
    return 'gold';
  } else if (score > 50) {
    return 'silver';
  } else {
    return 'bronze';
  }

  // @ts-expect-error
  return 'unknown'; // Error: Unreachable code detected.
}

// ✅ Best practice: set it to `false`. Dead code is usually a sign that a branch was
// edited and the lines after it were not looked at again.

// 🧪 Try it: delete the `allowUnreachableCode` line from this folder's tsconfig.json.
// `tsc` passes, apart from the three unused `@ts-expect-error` directives, and the
// editor shows the same three lines greyed out.

console.log(earlyReturn()); // done
console.log(alwaysThrows);
console.log(pickWinner(75)); // silver
