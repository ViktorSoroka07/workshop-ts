// =============================================================================
// noImplicitReturns
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitReturns

// Ensures every code path in a function returns a value (when the function
// has a non-void return type). Not part of `strict` — must be enabled separately.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// @ts-expect-error
function getDiscount(isMember: boolean): number {
  // ❌ Not all code paths return a value
  if (isMember) {
    return 0.1;
  }
  // forgot the else — returns `undefined` implicitly
}

// ---------------------------------------------------------------------------
// Fix: handle all paths
// ---------------------------------------------------------------------------

function getDiscountFixed(isMember: boolean): number {
  if (isMember) {
    return 0.1;
  }
  return 0; // ✅ all paths return a number
}

// This catches a common bug where you add a new branch (e.g., a new enum value)
// but forget to return something from it.
