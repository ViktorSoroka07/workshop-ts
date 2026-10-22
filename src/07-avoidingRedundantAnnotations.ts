// =============================================================================
// 7. Avoiding Redundant Type Annotations
// =============================================================================

// Now that we've seen types and functions, let's talk about when NOT to annotate.
// When TypeScript can infer the type, explicit annotations are redundant noise:

// Bad -- redundant annotations:
let maxRetries: number = 3;
let baseUrl: string = 'https://api.example.com';
let cacheEnabled: boolean = true;
const allowedPorts: number[] = [80, 443, 8080];

// Good -- let inference do its job:
let maxRetries2 = 3; // number
let baseUrl2 = 'https://api.example.com'; // string
let cacheEnabled2 = true; // boolean
const allowedPorts2 = [80, 443, 8080]; // number[]

// When you SHOULD annotate:

// 1. Variables without initializers:
let connectionString: string;
connectionString = 'postgres://localhost:5432/mydb';

// 2. Function parameters -- TypeScript cannot infer these:
function parsePort(raw: string) {
  return parseInt(raw, 10); // return type inferred as `number`
}

function buildUrl(host: string, port: number) {
  return `https://${host}:${port}`; // return type inferred as `string`
}

// 3. Function return types -- when the function promises a specific shape:
type Account = { id: number; email: string };

//    With the return type, a typo is caught right where you made it:
function createAccount(email: string): Account {
  // @ts-expect-error
  return { id: Date.now(), emial: email }; // Error: 'emial' does not exist in type 'Account'. Did you mean to write 'email'?
}

//    Without it, the function happily returns the typo -- the error shows up later, at the caller:
function createAccountNoAnnotation(email: string) {
  return { id: Date.now(), emial: email }; // no error here
}

const account = createAccountNoAnnotation('alice@example.com');
// @ts-expect-error
account.email; // Error: Property 'email' does not exist on type '{ id: number; emial: string; }'

// ✅ Best practice: annotate parameters, and return types of functions others call;
// let inference do the rest.

// There's no tsconfig flag for this, but you can enforce it with ESLint:
// Rule: @typescript-eslint/no-inferrable-types
// It warns on `let x: number = 5` and suggests `let x = 5`.
// (Turned off in this repo's eslint.config.mjs so the "Bad" examples above can stay.)
