// =============================================================================
// ES Private Fields (`#`) vs TypeScript `private`
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#caveats

// TypeScript offers two ways to make fields private:
//
// 1. `private` keyword — compile-time only. Erased in the emitted JS, so the
//    field is accessible at runtime (e.g., via bracket notation or in devtools).
//    Allows cross-instance access within the same class.
//
// 2. `#field` (ES private) — enforced at runtime by the JavaScript engine.
//    Truly invisible outside the class, even in plain JS. Cannot be accessed
//    via bracket notation or reflection.
//
// Prefer `#field` when you need hard runtime privacy (e.g., security-sensitive
// data). Use `private` when compile-time checking is sufficient.

class BankAccount {
  // TypeScript `private` — erased at runtime, only enforced by the compiler
  private balance: number;

  // ES private field — enforced at runtime by the JS engine
  #pin: number;

  constructor(balance: number, pin: number) {
    this.balance = balance;
    this.#pin = pin;
  }

  verifyPin(pin: number): boolean {
    return this.#pin === pin;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount(1000, 1234);

// Both are errors at compile time:
// @ts-expect-error
console.log(account.balance); // Error: Property 'balance' is private and only accessible within class 'BankAccount'.
// @ts-expect-error
console.log(account.#pin); // Error: Property '#pin' is not accessible outside class 'BankAccount'.

// But at runtime (in emitted JS), `private` is NOT enforced:
console.log((account as any).balance); // 1000 — accessible via escape hatch
console.log((account as any)['#pin']); // undefined — ES private fields are truly hidden
