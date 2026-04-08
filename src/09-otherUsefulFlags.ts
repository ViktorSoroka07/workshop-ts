// =============================================================================
// Other Useful Flags
// =============================================================================

// ---------------------------------------------------------------------------
// useUnknownInCatchVariables (part of `strict`)
// ---------------------------------------------------------------------------
// https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables

// Catch variables are `unknown` instead of `any`, forcing you to check the type:

try {
  throw new Error('oops');
} catch (err) {
  // err is `unknown` — must narrow before using:
  if (err instanceof Error) {
    console.log(err.message); // ✅ safe
  }
}

// ---------------------------------------------------------------------------
// noFallthroughCasesInSwitch
// ---------------------------------------------------------------------------
// https://www.typescriptlang.org/tsconfig/#noFallthroughCasesInSwitch

// Errors when a switch case has code but no `break` or `return`:

type Status = 'active' | 'inactive' | 'pending';

function getLabel(status: Status): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'pending':
      return 'Pending';
  }
}

// ---------------------------------------------------------------------------
// strictBindCallApply (part of `strict`)
// ---------------------------------------------------------------------------
// https://www.typescriptlang.org/tsconfig/#strictBindCallApply

// Type-checks arguments passed to .bind(), .call(), and .apply():

function greet(name: string, age: number) {
  return `Hello ${name}, you are ${age}`;
}

greet.call(null, 'Alice', 30);  // ✅
// @ts-expect-error
greet.call(null, 'Alice');      // ❌ Expected 2 arguments, but got 1

// ---------------------------------------------------------------------------
// noImplicitThis (part of `strict`)
// ---------------------------------------------------------------------------
// https://www.typescriptlang.org/tsconfig/#noImplicitThis

// Errors when `this` has an implied `any` type:

// A regular function inside a method loses the `this` context:
//
//   class Button {
//     label = 'Click me';
//     getHandler() {
//       return function () {
//         console.log(this.label); // ❌ 'this' implicitly has type 'any'
//       };
//     }
//   }

// Fix: use arrow function (captures `this` from surrounding scope):
class Button {
  label = 'Click me';

  getHandler() {
    return () => {
      console.log(this.label); // ✅ `this` is Button
    };
  }
}

// ---------------------------------------------------------------------------
// forceConsistentCasingInFileNames
// ---------------------------------------------------------------------------
// https://www.typescriptlang.org/tsconfig/#forceConsistentCasingInFileNames

// Ensures import paths match the actual file name casing on disk.
// macOS and Windows file systems are case-insensitive by default,
// so `import { User } from './user'` works even if the file is `User.ts`.
// But on Linux (and most CI servers), it's case-sensitive — the build breaks.
//
// With this flag, TS catches the mismatch locally before it hits CI:
//
//   // File on disk: src/User.ts
//   import { User } from './user';  // ❌ Error — casing doesn't match
//   import { User } from './User';  // ✅
