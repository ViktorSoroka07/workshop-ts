// =============================================================================
// noImplicitAny
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitAny

// Raises an error when TS can't infer a type and would silently fall back to `any`.
// Without this flag, untyped code compiles fine but gives you zero type safety.

// ---------------------------------------------------------------------------
// Untyped function parameters
// ---------------------------------------------------------------------------

// @ts-expect-error
function add(a, b) { // ❌ Parameter 'a' implicitly has an 'any' type
  return a + b;
}

// Fix: add types explicitly
function addFixed(a: number, b: number) {
  return a + b;
}

// ---------------------------------------------------------------------------
// Untyped callbacks
// ---------------------------------------------------------------------------

// TS can infer types from context — array methods know their element types:
const numbers = [1, 2, 3].map((item) => item.toFixed()); // ✅ TS infers `number` from the array

// But a standalone callback with no context gets `any`:
// @ts-expect-error
function process(callback) { // ❌ Parameter 'callback' implicitly has an 'any' type
  callback();
}

// Fix: type the callback
function processFixed(callback: () => void) {
  callback();
}

// ---------------------------------------------------------------------------
// Why it matters
// ---------------------------------------------------------------------------

// `any` silently disables all type checking. With `noImplicitAny`, TS makes
// you choose: either provide a type, or explicitly write `any` to show
// that you're opting out intentionally.

function legacy(data: any) { // ✅ explicit `any` is allowed — you made a conscious choice
  return data.whatever;
}
