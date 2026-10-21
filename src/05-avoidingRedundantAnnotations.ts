// =============================================================================
// 5. Avoiding Redundant Type Annotations
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

// 2. When inference gives a wider type than you want:
let connectionState: 'connecting' | 'open' | 'closed' = 'closed'; // without annotation, inferred as string

// 3. Function parameters -- TypeScript cannot infer these:
function parsePort(raw: string) {
  return parseInt(raw, 10);
}

function toQueryString(params: { [key: string]: string }) {
  return new URLSearchParams(params).toString(); // return type inferred as `string`
}

// 4. Function return types -- but only when it actually helps:
//    - Public API / library functions (documents the contract):
function findUser(id: number): { id: number; email: string } | null {
  return { id, email: 'alice@example.com' };
}

//    Without the return type, a mistake silently changes the public API:
function findUserNoAnnotation(id: number) {
  // Forgot to handle the "not found" case -- but no error!
  // Callers won't know they should check for null.
  return { id, email: 'alice@example.com' };
}

//    With the explicit return type, the contract is enforced:
function findUserById(id: number): { id: number; email: string } | null {
  // Even though this always returns an object right now,
  // the `| null` return type forces callers to handle the null case.
  // If someone later adds a `return null` path, callers are already prepared.
  return { id, email: 'alice@example.com' };
}

const foundUser = findUserById(1);

foundUser?.id;

//    - When you want to catch mistakes early (complex return paths)
//    For simple/internal functions, let inference do the work.

// There's no tsconfig flag for this, but you can enforce it with ESLint:
// Rule: @typescript-eslint/no-inferrable-types
// It warns on `let x: number = 5` and suggests `let x = 5`.
// (Turned off in this repo's eslint.config.mjs so the "Bad" examples above can stay.)
