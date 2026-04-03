// =============================================================================
// Constructor Overloads
// =============================================================================

// TypeScript supports constructor overloading through multiple signatures followed
// by a single implementation. Unlike Java/C#, you write one body that handles all
// cases — the overload signatures exist only for the caller's type checking.
//
// This example also demonstrates `readonly` properties that can only be assigned
// in the constructor (similar to Java's `final` fields).

export class HttpHeader {
  private readonly name: string;
  private readonly value: string;

  // Overload signatures — only for the caller's type checking:
  constructor(name: string, value: string);
  constructor(raw: string); // e.g. "Content-Type: application/json"

  // Single implementation handles all cases:
  constructor(nameOrRaw: string, value?: string) {
    if (value !== undefined) {
      this.name = nameOrRaw;
      this.value = value;
    } else {
      // Parse raw header string like "Content-Type: application/json"
      const [headerName, ...rest] = nameOrRaw.split(':');

      this.name = headerName.trim();
      this.value = rest.join(':').trim();
    }

    console.log(`${this.name}: ${this.value}`);
  }

  // `readonly` prevents reassignment after construction:
  update(value: string) {
    // @ts-expect-error
    this.value = value; // Error: Cannot assign to 'value' because it is a read-only property.
  }
}

new HttpHeader('Content-Type: application/json'); // Content-Type: application/json
new HttpHeader('Authorization', 'Bearer tok_abc123'); // Authorization: Bearer tok_abc123

/*
Java version — each overload has its own body (true method overloading):

public class HttpHeader {
    private final String name;
    private final String value;

    public HttpHeader(String name, String value) {
        this.name = name;
        this.value = value;

        System.out.println(this.name + ": " + this.value);
    }

    public HttpHeader(String raw) {
        String[] parts = raw.split(":", 2);
        this.name = parts[0].trim();
        this.value = parts[1].trim();

        System.out.println(this.name + ": " + this.value);
    }

    public static void main(String[] args) {
        new HttpHeader("Content-Type: application/json");
        new HttpHeader("Authorization", "Bearer tok_abc123");
    }
}
*/
