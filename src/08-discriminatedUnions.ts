// =============================================================================
// 8. Discriminated Unions
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

// Gotcha: build the object first and the tag widens to `string` (02-letVsConst.ts), so it no longer matches:
const saved = { status: 'success', data: ['alice'] }; // type: { status: string; data: string[] }
// @ts-expect-error
handleResponse(saved); // Error: Type 'string' is not assignable to type '"success"'
// Fix: annotate the variable -- `const saved: ApiResponse = { ... }`.

// This pattern is everywhere: Redux actions, XState events, tRPC responses.
