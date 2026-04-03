// =============================================================================
// Access Modifiers: public, private, protected
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility

// TypeScript adds three access modifiers that control where a class member
// can be accessed from. These are compile-time only — they are erased in
// the emitted JavaScript (see 02-esPrivateVsPrivate.ts for runtime privacy).

class HttpClient {
  // `public` — accessible from anywhere. This is the default, so in practice
  // you'd omit it. Written explicitly here to contrast with the other modifiers:
  public baseUrl: string;

  // `private` — only accessible within THIS class, not even subclasses:
  private apiKey: string;

  // `protected` — accessible within this class AND subclasses, but not outside:
  protected timeout: number;

  constructor(baseUrl: string, apiKey: string, timeout: number = 5000) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  // Private helper — internal implementation detail, hidden from consumers:
  private buildHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  fetch(endpoint: string): void {
    const headers = this.buildHeaders();
    console.log(`GET ${this.baseUrl}${endpoint}`, {
      headers,
      timeout: this.timeout,
    });
  }
}

class AuthenticatedClient extends HttpClient {
  refreshToken(): void {
    // `protected` — accessible in subclass:
    console.log(`Refreshing token with timeout ${this.timeout}ms...`);

    // `private` — NOT accessible in subclass:
    // @ts-expect-error
    console.log(this.apiKey); // Error: Property 'apiKey' is only accessible within class 'HttpClient'.

    // @ts-expect-error
    this.buildHeaders(); // Error: Property 'buildHeaders' is only accessible within class 'HttpClient'.
  }
}

const client = new AuthenticatedClient(
  'https://api.example.com',
  'sk_live_abc123'
);

// `public` — accessible from outside:
console.log(client.baseUrl); // https://api.example.com

// `protected` — NOT accessible from outside:
// @ts-expect-error
console.log(client.timeout); // Error: Property 'timeout' is protected and only accessible within class and subclasses.

// `private` — NOT accessible from outside:
// @ts-expect-error
console.log(client.apiKey); // Error: Property 'apiKey' is private and only accessible within class 'HttpClient'.
