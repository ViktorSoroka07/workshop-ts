// =============================================================================
// 7. Union Types
// =============================================================================

// A value that can be one of several types:
function formatId(id: string | number): string {
  // With a union, you can only access members common to ALL constituents:
  // @ts-expect-error
  id.toUpperCase(); // Error: Property 'toUpperCase' does not exist on type 'number'

  // You must narrow first (09-narrowing.ts):
  return String(id);
}

formatId('abc-123'); // OK
formatId(42); // OK
// @ts-expect-error
formatId(true); // Error: 'boolean' is not assignable to 'string | number'

// Unions of literal types restrict values to an exact set:
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function sendRequest(url: string, method: HttpMethod) {
  console.log(`${method} ${url}`);
}

sendRequest('/api/users', 'GET'); // OK
// @ts-expect-error
sendRequest('/api/users', 'PATCH'); // Error: '"PATCH"' is not assignable to type 'HttpMethod'

// This is where widening bites -- `method` and `DEFAULT_METHOD` come from 02-letVsConst.ts.
// `let method = 'GET'` is a `string`, not a 'GET':
// @ts-expect-error
sendRequest('/api/users', method); // Error: Argument of type 'string' is not assignable to parameter of type 'HttpMethod'
sendRequest('/api/users', DEFAULT_METHOD); // OK -- `const` kept the literal type "GET"

// Numeric literal unions work too:
type HttpSuccessCode = 200 | 201 | 204;
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Union of object types:
type TextInput = { type: 'text'; value: string; maxLength: number };
type NumberInput = { type: 'number'; value: number; min: number; max: number };
type FormField = TextInput | NumberInput;

// You can only access shared properties without narrowing:
function getFieldValue(field: FormField) {
  return field.value; // OK -- both TextInput and NumberInput have `value`; hover: string | number
}

function getMaxLength(field: FormField) {
  // @ts-expect-error
  return field.maxLength; // Error: Property 'maxLength' does not exist on type 'NumberInput'
}
// 09-narrowing.ts's `describeField` is how you get to `maxLength`: narrow first.
