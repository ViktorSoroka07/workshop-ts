// =============================================================================
// 15. Enums vs Literal Unions
// =============================================================================

// Enums generate real JavaScript code -- they exist at runtime as objects.
// Literal unions (e.g., `type Method = 'GET' | 'POST'`) are erased at compile time
// and produce zero JavaScript output.

// --- Numeric enum ---
enum Priority {
  Low, // 0
  Medium, // 1
  High, // 2
  Critical, // 3
}

console.log(Priority.High); // 2
console.log(Priority[0]); // "Low" (reverse mapping -- numeric enums only)

// ⚠️ Gotcha 1: a numeric enum accepts ANY number from a variable -- e.g. data from an API:
const priorityFromApi: number = 99;
const priority: Priority = priorityFromApi; // no error -- yet there is no Priority 99
// (Only a literal is checked: `const p: Priority = 99` is an error.)

// ⚠️ Gotcha 2: the reverse mapping doubles the keys -- a dropdown built from them shows 8 options, not 4:
Object.keys(Priority); // ['0', '1', '2', '3', 'Low', 'Medium', 'High', 'Critical']

// --- String enum ---
enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}

function setRole(role: UserRole) {
  console.log(role);
}

setRole(UserRole.Admin); // OK
// @ts-expect-error
setRole('ADMIN'); // Error: Argument of type '"ADMIN"' is not assignable to parameter of type 'UserRole'
// A string enum accepts only its own members -- every caller must import the enum.

// --- const enum (inlined at compile time, no runtime object) ---
const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

const level = LogLevel.Info; // compiles to: const level = 1;

// ⚠️ Gotcha: `const enum` only works when `tsc` compiles the whole project.
// Single-file transpilers (Babel, SWC, esbuild) process each file in isolation --
// they can't look up the enum definition from another file to inline the values.
// The tsconfig flag `isolatedModules: true` warns about this and other patterns
// that break under single-file transpilation. Most modern setups enable it.
// For this reason, the community generally prefers `as const` objects (see below).

// --- Alternative: `as const` object + derived union (community-preferred) ---
const HttpStatus = {
  Ok: 200,
  NotFound: 404,
  ServerError: 500,
} as const;

// `typeof` extracts the type from a value, `keyof` gets its keys as a union.
// Combined, this derives a union of the object's values:
type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus]; // 200 | 404 | 500
// These operators were covered in 14-typeofKeyofIndexedAccess.ts.

function respond(code: HttpStatusCode) {
  console.log(code);
}

respond(HttpStatus.Ok); // OK -- named, like an enum
respond(200); // OK -- the raw value works too (a string enum would reject this)
// @ts-expect-error
respond(201); // Error: Argument of type '201' is not assignable to parameter of type 'HttpStatusCode'

// ✅ Best practice: prefer an `as const` object (or a plain literal union) over an enum:
// - No extra runtime code generated
// - Works with --isolatedModules (const enums don't -- see the gotcha above)
// - Standard JavaScript object -- no TS-specific syntax, so it also runs where TypeScript is
//   executed by just removing the types (e.g. Node.js's built-in TypeScript support)
// - Accepts the raw value (`respond(200)`) and still rejects wrong ones (`respond(201)`)
// - None of the numeric enum gotchas above
