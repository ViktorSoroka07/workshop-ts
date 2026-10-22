// =============================================================================
// 10. Discriminated Unions
// =============================================================================

// A discriminated union is a union of object types where each member has
// a common property (the "discriminant") with a unique literal value.
// TypeScript uses that property to automatically narrow the type in branches.
//
// The pattern: shared tag field + switch/if → full type safety.
type SuccessResponse = { status: 'success'; data: string[] };
type ErrorResponse = { status: 'error'; message: string };
type LoadingResponse = { status: 'loading'; placeholder: 'Loading...' };

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse;

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      console.log(response.data); // narrowed to SuccessResponse
      break;
    case 'error':
      console.log(response.message); // narrowed to ErrorResponse
      break;
    case 'loading':
      console.log(response.placeholder); // narrowed to LoadingResponse
      console.log('Loading...');
      break;
  }
}

handleResponse({ status: 'success', data: ['alice'] }); // OK -- literal in place, `status` stays "success"

// ⚠️ Gotcha: build the object first and the tag widens to `string` (02-letVsConst.ts), so it no longer matches:
const saved = { status: 'success', data: ['alice'] }; // type: { status: string; data: string[] }
// @ts-expect-error
handleResponse(saved); // Error: Type 'string' is not assignable to type '"success"'
// Fix: annotate the variable -- `const saved: ApiResponse = { ... }`.

// This pattern is everywhere: Redux actions, XState events, tRPC responses.

// --- Exhaustive check pattern ---
// After every case is handled, nothing is left -- the type in `default` is `never`
// (08-anyUnknownNever.ts). Assigning to `never` turns a forgotten case into a compile error:
function getStatusLabel(response: ApiResponse): string {
  switch (response.status) {
    case 'success':
      return 'Done';
    case 'error':
      return 'Failed';
    case 'loading':
      return 'Loading...';
    default:
      const _exhaustive: never = response; // hover `response`: never
      return _exhaustive;
  }
}

// 🧪 Try it: add `{ status: 'retrying' }` to ApiResponse -- `default` now gets that type,
// and the `never` line fails to compile until you add a case for it.

// ✅ Best practice: give a `switch` over a union a `never` default, so adding a member
// points you to every place that must handle it.
