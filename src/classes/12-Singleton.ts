// =============================================================================
// Singleton Pattern (Private Constructor & Static Members)
// =============================================================================

// A private constructor prevents direct instantiation with `new`. Combined with
// a static `getInstance()` method, this enforces the Singleton pattern — only
// one instance ever exists.

class ConnectionPool {
  private static instance: ConnectionPool;

  // Static block — runs once when the class is first accessed.
  // Useful for one-time initialization or setup logic:
  static {
    console.log('ConnectionPool class loaded');
  }

  // Private constructor — only callable from inside the class (via `getInstance`):
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

ConnectionPool.getInstance().query('SELECT * FROM users'); // First call — creates the pool
ConnectionPool.getInstance().query('SELECT * FROM orders'); // Reuses the existing pool
