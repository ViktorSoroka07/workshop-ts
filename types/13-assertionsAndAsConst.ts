// =============================================================================
// 13. Type Assertions and `as const`
// =============================================================================

// --- `as` assertion: you tell TypeScript what a type is ---
const rawInput = document.getElementById('email'); // type: HTMLElement | null
// @ts-expect-error
rawInput.value; // Error: 'rawInput' is possibly 'null'. (and: Property 'value' does not exist on type 'HTMLElement'.)

const emailInput = document.getElementById('email') as HTMLInputElement;
emailInput.value; // OK -- you asserted it's an HTMLInputElement

// `as` is not a cast: the two types must overlap, so a plain lie is still caught:
// @ts-expect-error
const port = '5432' as number; // Error: Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
const portForced = '5432' as unknown as number; // compiles -- the double assertion is the escape hatch, use with care

// ⚠️ Gotcha: `as` does NOT perform a runtime check. If wrong, you get runtime errors.
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

// The properties are read-only now:
// @ts-expect-error
ROUTES.home = '/start'; // Error: Cannot assign to 'home' because it is a read-only property.

// And they keep their literal types, so they fit a union of exact values (09-unionTypes.ts);
// without `as const` they would be plain strings and `navigate(ROUTES.about)` would fail:
function navigate(path: '/' | '/about' | '/contact') {
  console.log(path);
}

navigate(ROUTES.about); // OK

// `as const` also fixes the tuple inference problem from 03-objectArraysTuples.ts:
const point = [40.7128, -74.006] as const; // type: readonly [40.7128, -74.006]
