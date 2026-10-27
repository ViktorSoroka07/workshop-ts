// =============================================================================
// 5. Index Signatures
// =============================================================================

// When you don't know property names ahead of time, use an index signature
// to describe the shape of dynamic keys:
type HttpHeaders = {
  [header: string]: string;
};

const headers: HttpHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer token123',
};

headers['X-Custom'] = 'value'; // OK -- any string key is allowed
headers[42] = 'answer'; // also OK -- JavaScript turns every key into a string, so this key is '42'

// You can mix known and dynamic properties:
type ApiConfig = {
  baseUrl: string;
  timeout: number;
  [option: string]: string | number; // `|` = "one of these" (09-unionTypes.ts); must cover the known properties
};

// Without that cover, the known property is rejected:
type BadConfig = {
  // @ts-expect-error
  baseUrl: string; // Error: Property 'baseUrl' of type 'string' is not assignable to 'string' index type 'number'.
  [option: string]: number;
};

// Numeric index signatures work too -- this is how arrays are typed internally:
type StringArray = {
  [index: number]: string;
};

const colors: StringArray = { 0: 'red', 1: 'green', 2: 'blue' };

// The reverse is NOT allowed -- a number signature promises only number keys:
// @ts-expect-error
colors['first']; // Error: Element implicitly has an 'any' type because index expression is not of type 'number'.

// ⚠️ Gotcha: accessing a key that doesn't exist returns `undefined` at runtime,
// but TypeScript still says the type is `string` -- no error, no warning:
const missing = headers['X-Not-Set']; // type: string -- actual value: undefined
missing.toUpperCase(); // no error -- at runtime: TypeError: Cannot read properties of undefined

// This is a known blind spot. The `noUncheckedIndexedAccess` flag closes it
// (../flags/09-noUncheckedIndexedAccess/index.ts).
