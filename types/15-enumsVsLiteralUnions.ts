// =============================================================================
// 15. Enums vs Literal Unions
// =============================================================================

// You will meet enums in older codebases and some frameworks; here is what they cost
// and what to write instead.

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
// Only a literal is checked:
// @ts-expect-error
const literalPriority: Priority = 99; // Error: Type '99' is not assignable to type 'Priority'.

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
setRole('ADMIN'); // Error: Argument of type '"ADMIN"' is not assignable to parameter of type 'UserRole'.
// A string enum accepts only its own members -- every caller must import the enum.

// `const enum` inlines the values instead of creating an object, but it breaks under Babel,
// SWC and esbuild, which compile each file alone and cannot look the enum up. Avoid it.

// --- Alternative: `as const` object + derived union (community-preferred) ---
// 🎓 On your own: harder because one type chains `typeof`, `keyof` and an indexed access.
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
respond(201); // Error: Argument of type '201' is not assignable to parameter of type 'HttpStatusCode'.

// ✅ Best practice: prefer an `as const` object (or a plain literal union) over an enum:
// - No extra runtime code generated
// - Works with single-file transpilers (`const enum` doesn't)
// - Standard JavaScript object -- no TS-specific syntax, so it also runs where TypeScript is
//   executed by just removing the types (e.g. Node.js's built-in TypeScript support)
// - Accepts the raw value (`respond(200)`) and still rejects wrong ones (`respond(201)`)
// - None of the numeric enum gotchas above
