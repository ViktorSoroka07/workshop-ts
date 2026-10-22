// =============================================================================
// strictPropertyInitialization (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strictPropertyInitialization

// A class field whose type does not include `undefined` must be set in its declaration
// or in the constructor. Initializing fields is the subject of
// ../../classes/06-initializingFields.ts; this lesson holds the fixes.
//
// Needs `strictNullChecks` (02): without it `undefined` fits every type and nothing
// is missing. This lesson's tsconfig sets both.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

class CustomerBroken {
  name: string;

  // @ts-expect-error
  email: string; // Error: Property 'email' has no initializer and is not definitely assigned in the constructor.

  constructor(name: string) {
    this.name = name;
    // `email` is never assigned
  }
}

console.log(new CustomerBroken('Ana').email); // undefined -- while the type says `string`

// ---------------------------------------------------------------------------
// Ways to fix it
// ---------------------------------------------------------------------------

// 1. Assign in the constructor:
class CustomerWithConstructor {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

// 2. Give the declaration a default value:
class CustomerWithDefault {
  name: string;
  email: string = '';

  constructor(name: string) {
    this.name = name;
  }
}

// 3. Definite assignment assertion `!` -- "I will set this before it is read, trust me":
class CustomerWithAssertion {
  name: string;
  email!: string;

  constructor(name: string) {
    this.name = name;
  }
}

// ✅ Best practice: use `!` only when something outside the class guarantees the value
// (a framework that injects it after construction). The compiler stops checking that
// field: reading it too early gives `undefined`, as above.

// 4. Make the type say it can be missing:
class CustomerWithOptional {
  name: string;
  email?: string;

  constructor(name: string) {
    this.name = name;
  }
}

// Every reader now handles the missing case (02), which is what is true of the field.
const customer = new CustomerWithOptional('Ana');
// @ts-expect-error
customer.email.toLowerCase(); // Error: 'customer.email' is possibly 'undefined'.

// ⚠️ Gotcha: the check reads the constructor only. A helper method that sets the field
// is not seen, even when the constructor calls it:
class CustomerWithHelper {
  // @ts-expect-error
  email: string; // Error: Property 'email' has no initializer and is not definitely assigned in the constructor.

  constructor() {
    this.loadEmail();
  }

  private loadEmail() {
    this.email = 'ana@example.com';
  }
}

console.log(
  CustomerWithConstructor,
  CustomerWithDefault,
  CustomerWithAssertion,
  CustomerWithHelper
);
