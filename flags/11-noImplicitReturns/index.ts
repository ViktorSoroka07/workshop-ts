// =============================================================================
// noImplicitReturns
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitReturns

// Errors when a function returns a value on some paths and falls off its end on
// others. NOT part of `strict`: switch it on separately.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// @ts-expect-error
function discountFor(isMember: boolean) {
  // Error: Not all code paths return a value.
  if (isMember) {
    return 0.1;
  }
}

// A non-member falls off the end and gets `undefined`, which the caller uses as a number:
console.log(100 * (1 - discountFor(false))); // NaN

// Fix: every path returns.
function discountForFixed(isMember: boolean) {
  if (isMember) {
    return 0.1;
  }

  return 0;
}

// ---------------------------------------------------------------------------
// A branch added later
// ---------------------------------------------------------------------------

type Plan = 'free' | 'pro' | 'team';

// @ts-expect-error
function seatLimit(plan: Plan) {
  // Error: Not all code paths return a value.
  switch (plan) {
    case 'free':
      return 1;
    case 'pro':
      return 10;
  }
}

// 'team' has no case. With a case for every member the error is gone, and it comes
// back the day a member is added to `Plan` and this `switch` is not updated:
function seatLimitFixed(plan: Plan) {
  switch (plan) {
    case 'free':
      return 1;
    case 'pro':
      return 10;
    case 'team':
      return 50;
  }
}

// ⚠️ Gotcha: under `strictNullChecks` (02) a function WITH a return type annotation that
// excludes `undefined` is caught anyway, by a different error:
//   function seatLimit(plan: Plan): number { … }
//   Error: Function lacks ending return statement and return type does not include 'undefined'.
// The flag earns its place on functions whose return type is inferred, as above, and on
// return types that include `undefined`.

console.log(discountForFixed(false), seatLimit, seatLimitFixed('team')); // 0 [Function: seatLimit] 50
