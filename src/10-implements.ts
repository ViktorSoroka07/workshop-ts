// =============================================================================
// Implementing Interfaces
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses

// The `implements` keyword declares that a class satisfies a particular contract
// (interface). TypeScript will error if the class is missing any required members.
//
// A class can implement multiple interfaces — unlike inheritance (`extends`),
// which is limited to a single base class.
//
// Interfaces vs abstract classes:
//   - Interface = pure contract. No implementation, no state, no constructor.
//   - Abstract class = contract + shared code. Can have fields, constructors,
//     and concrete methods that subclasses inherit (see 09-abstract.ts).
//
// Use an interface when you only need a shape/contract.
// Use an abstract class when subclasses should share code or state.

interface Serializable {
  serialize(): string;
}

interface Loggable {
  log(): void;
}

// Implementing multiple interfaces — the class must provide all members from both:
class ApiResponse implements Serializable, Loggable {
  constructor(
    public status: number,
    public body: string
  ) {}

  serialize(): string {
    return JSON.stringify({ status: this.status, body: this.body });
  }

  log(): void {
    console.log(`[${this.status}] ${this.body}`);
  }
}

const response = new ApiResponse(200, 'OK');
response.log(); // [200] OK
console.log(response.serialize()); // {"status":200,"body":"OK"}

// Important caveat: `implements` only checks the contract at the declaration site.
// It does NOT add any types to the class body — you still need to declare every
// member yourself. Missing a member is a compile error:

interface Identifiable {
  id: string;
}

// @ts-expect-error
class User implements Identifiable {
  // Error: Property 'id' is missing in type 'User' but required in type 'Identifiable'.
}

// Another gotcha: `implements` does NOT infer parameter types from the interface.
// You might expect `input` to be inferred as `string` from the interface — it isn't.
// You must annotate it yourself:

interface Formatter {
  format(input: string): string;
}

class UpperCaseFormatter implements Formatter {
  // Even though the interface says `input: string`, you still need to write it here.
  // Without `noImplicitAny` (or `strict` which includes it) this would silently be `any`:
  format(input: string) {
    return input.toUpperCase();
  }
}
