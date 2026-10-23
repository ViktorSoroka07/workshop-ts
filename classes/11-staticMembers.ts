// =============================================================================
// Static Members and the Singleton Pattern
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members

// Static members belong to the class itself, not to instances.
// They're accessed via the class name, not via `this` on an instance.

class Pagination {
  // Static property — shared across all uses, no instance needed:
  static maxPageSize: number = 100;

  // Static method — called on the class, not on an instance:
  static clampPageSize(size: number): number {
    return Math.min(Math.max(size, 1), Pagination.maxPageSize);
  }
}

// Accessed directly on the class — no `new` required:
console.log(Pagination.maxPageSize); // 100
console.log(Pagination.clampPageSize(150)); // 100

// An instance does not carry them:
// @ts-expect-error
new Pagination().maxPageSize; // Error: Property 'maxPageSize' does not exist on type 'Pagination'. Did you mean to access the static member 'Pagination.maxPageSize' instead?

// Static blocks vs constructors:
//   - Constructor runs every time you call `new` — once per instance.
//   - Static block runs exactly once, when the class definition is evaluated
//     (i.e., when the JS engine first encounters the class declaration at runtime).
//     No `new` is needed — it fires even if you never create an instance.
//
// Inside a static block you can access all static members, including private ones.
// That's the key advantage over writing initialization outside the class — external
// code can't touch `private static` fields, but a static block can:

class AppConfig {
  // `private static` combines the two: one value shared by the whole class, hidden from
  // everything outside it:
  private static environment: string;
  private static debug: boolean;

  static {
    // This runs immediately when the file is loaded — before any `new AppConfig()`.
    // It can access `private static` fields — code outside the class can't:
    AppConfig.environment = 'production';
    AppConfig.debug = AppConfig.environment !== 'production';
  }

  static getSummary(): string {
    return `env=${AppConfig.environment}, debug=${AppConfig.debug}`;
  }
}

// The static block has already run by this point — no `new` needed:
console.log(AppConfig.getSummary()); // env=production, debug=false

// But we can't do this initialization outside the class:
// @ts-expect-error
AppConfig.environment = 'staging'; // Error: Property 'environment' is private and only accessible within class 'AppConfig'.

// --- Singleton pattern ---
// Combining `static` with a private constructor enforces "exactly one instance":

class ConnectionPool {
  private static instance: ConnectionPool;

  // Private constructor — prevents direct instantiation with `new`:
  private constructor(private readonly maxConnections: number) {
    console.log(`Pool created with max ${maxConnections} connections`);
  }

  // The only way to get an instance — creates one on first call, reuses it after:
  static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool(10);
    }

    return ConnectionPool.instance;
  }

  query(sql: string): void {
    console.log(`Executing: ${sql}`);
  }
}

// @ts-expect-error
new ConnectionPool(5); // Error: Constructor of class 'ConnectionPool' is private and only accessible within the class declaration.

ConnectionPool.getInstance().query('SELECT * FROM users'); // First call — creates the pool
ConnectionPool.getInstance().query('SELECT * FROM orders'); // Reuses the existing pool
