// =============================================================================
// strictPropertyInitialization
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strictPropertyInitialization

// Ensures class properties declared with a type are initialized —
// either in the declaration or in the constructor.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

class UserBroken {
  name: string;
  // @ts-expect-error
  email: string; // ❌ Property 'email' has no initializer and is not assigned in constructor

  constructor(name: string) {
    this.name = name;
    // forgot to assign this.email — would be `undefined` at runtime
  }
}

// ---------------------------------------------------------------------------
// Ways to fix it
// ---------------------------------------------------------------------------

// 1. Assign in constructor:
class User1 {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

// 2. Default value in declaration:
class User2 {
  name: string;
  email: string = '';

  constructor(name: string) {
    this.name = name;
  }
}

// 3. Definite assignment assertion `!` — tells TS "I'll set this later, trust me":
class User3 {
  name: string;
  email!: string; // ✅ no error, but YOU are responsible for assigning it

  constructor(name: string) {
    this.name = name;
  }
}

// Use `!` only when something else guarantees initialization
// (e.g., a framework like Angular that injects values after construction).
