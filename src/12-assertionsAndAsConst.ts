// =============================================================================
// 12. Type Assertions and `as const`
// =============================================================================

// --- `as` assertion: you tell TypeScript what a type is ---
const rawInput = document.getElementById('email'); // type: HTMLElement | null
// @ts-expect-error
rawInput.value; // Error: 'rawInput' is possibly 'null' (and 'value' does not exist on type 'HTMLElement')

const emailInput = document.getElementById('email') as HTMLInputElement;
emailInput.value; // OK -- you asserted it's an HTMLInputElement

// `as` is not a cast: the two types must overlap, so a plain lie is still caught:
// @ts-expect-error
const port = '5432' as number; // Error: Conversion of type 'string' to type 'number' may be a mistake
const portForced = '5432' as unknown as number; // compiles -- the double assertion is the escape hatch, use with care

// WARNING: `as` does NOT perform a runtime check. If wrong, you get runtime errors.
// ✅ Best practice: prefer narrowing over assertions whenever possible:
const el = document.getElementById('email');
if (el instanceof HTMLInputElement) {
  el.value; // safely narrowed, no assertion needed
}

// --- `as const`: freeze to the narrowest literal type ---
const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
} as const;

// Without `as const`: { home: string; about: string; contact: string }
// With `as const`:    { readonly home: "/"; readonly about: "/about"; readonly contact: "/contact" }

// `as const` also fixes the tuple inference problem from 06-objectArraysTuples.ts:
const point = [40.7128, -74.006] as const; // type: readonly [40.7128, -74.006]
