// =============================================================================
// strictNullChecks vs strict Mode
// =============================================================================
//
// `strictNullChecks` makes `null` and `undefined` their own distinct types,
// preventing accidental use where a concrete type is expected. `noImplicitAny`
// ensures every variable has an explicit type annotation.
//
// The `strict` flag enables BOTH of these plus several other checks — it's the
// recommended baseline for all TypeScript projects. See the full breakdown below.

let value: string | null;

function printLength(value: string) {
  console.log(value.length);
}

// error both in `strictNullChecks` mode but no error in `noImplicitAny` mode
// @ts-expect-error
printLength(value);

interface User {
  name: string;
  age: number;
}

const users = [
  { name: 'Oby', age: 12 },
  { name: 'Heera', age: 32 },
];

const loggedInUsername = 'asdf';
const loggedInUser = users.find((user) => user.name === loggedInUsername);

loggedInUser?.age; // no error due to optional chaining

if (loggedInUser) {
  console.log(loggedInUser.age); // no error due to control flow analysis
}

// The `as` operator in TypeScript is used for type assertions, allowing you to tell the compiler to treat a value as a specific type. For example, `(loggedInUser as User).age` asserts that `loggedInUser` is of type `User`, even if its actual type may be `User | undefined`.
console.log((loggedInUser as User).age);
// The `!` (non-null assertion) operator can also be used to tell TypeScript that a value is not `null` or `undefined`, e.g., `loggedInUser!.age`, but use it with caution as it bypasses type safety.
console.log(loggedInUser!.age);

// ---------

// error in `noImplicitAny` mode about untyped parameters but no error in `strictNullChecks`
// @ts-expect-error
function add(a, b) {
  return a.toString() + b.toString();
}

// strict flag is combination of these flags:
// - noImplicitAny - Raises error on expressions and declarations with an implied `any` type.
// - strictNullChecks - When enabled, `null` and `undefined` are only assignable to themselves and `any` (unless otherwise specified with a union type).
// - strictFunctionTypes - Ensures function type parameters are checked more strictly.
// - strictBindCallApply - Checks that the built-in methods `bind`, `call`, and `apply` methods on functions are invoked with correct argument types.
// - strictPropertyInitialization - Ensures that class properties are initialized in the constructor.
// - noImplicitThis - Raises error on `this` expressions with an implied `any` type.
// - alwaysStrict - Ensures that your files are parsed in the ECMAScript strict mode, and emit “use strict” for each source file.

// Enabling `strict` mode is recommended for better type safety in TypeScript projects.

// Other useful flags
// - allowUnreachableCode - https://www.typescriptlang.org/tsconfig/#allowUnreachableCode. By default, TypeScript reports an error when it detects unreachable code. This flag can be used to disable that check.
// - allowUnusedLabels - https://www.typescriptlang.org/tsconfig/#allowUnusedLabels. By default, TypeScript reports an error when it detects unused labels. This flag can be used to disable that check.
// - exactOptionalPropertyTypes - https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes. When enabled, optional properties are treated as exactly the type specified or `undefined`, rather than being widened to include `undefined`.
// - noFallthroughCasesInSwitch - https://www.typescriptlang.org/tsconfig/#noFallthroughCasesInSwitch. Enables error reporting for fallthrough cases in switch statements.
// - noImplicitReturns - https://www.typescriptlang.org/tsconfig/#noImplicitReturns. Enables error reporting for functions that do not have a return statement on all code paths.
// - noPropertyAccessFromIndexSignature - https://www.typescriptlang.org/tsconfig/#noPropertyAccessFromIndexSignature. When enabled, disallows accessing properties through dot notation on types that have index signatures.
// - noUncheckedIndexedAccess - https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess. When enabled, adds `undefined` to the type of indexed access expressions for types that do not have a definite property at the given index.
// - useUnknownInCatchVariables - https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables. When enabled, catch clause variables are typed as `unknown` instead of `any`.
