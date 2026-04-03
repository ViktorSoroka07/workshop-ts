// =============================================================================
// Parameter Properties
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties

// Parameter properties let you declare and initialize class fields directly in
// the constructor signature by prefixing parameters with an access modifier
// (`public`, `private`, `protected`) or `readonly`.
// This eliminates the boilerplate of declaring fields and assigning them manually.

// Shorthand: access modifiers in the constructor declare AND initialize fields
export class DatabaseConfigShort {
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly database: string
  ) {}

  toString(): string {
    return `${this.host}:${this.port}/${this.database}`;
  }
}

// Verbose equivalent — same behavior, more boilerplate.
// Every field must be declared separately, then assigned in the constructor:
export class DatabaseConfig {
  private readonly host: string;
  private readonly port: number;
  private readonly database: string;

  constructor(host: string, port: number, database: string) {
    this.host = host;
    this.port = port;
    this.database = database;
  }

  toString() {
    return `${this.host}:${this.port}/${this.database}`;
  }
}

console.log(new DatabaseConfigShort('localhost', 5432, 'app_db')); // localhost:5432/app_db
console.log(new DatabaseConfig('localhost', 5432, 'app_db').toString()); // localhost:5432/app_db
