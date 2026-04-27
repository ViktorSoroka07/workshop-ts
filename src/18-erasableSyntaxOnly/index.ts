// =============================================================================
// erasableSyntaxOnly
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly

// Bans TypeScript-specific syntax that emits runtime code, leaving only
// constructs that disappear when types are stripped.
//
// Useful when:
//   - targeting Node's `--experimental-strip-types` (TS 5.8 / Node 22+)
//   - using a type-stripper like ts-blank-space
//   - aligning with TC39's "Type Annotations" proposal
//
// In short: every TS feature must compile to "the same JS, minus the types."

// ---------------------------------------------------------------------------
// What it bans
// ---------------------------------------------------------------------------

// 1. enums (emit a runtime object)

// @ts-expect-error
enum Color {
  Red,
  Green,
  Blue,
} // ❌ This syntax is not allowed when 'erasableSyntaxOnly' is enabled.

// 2. namespaces that contain values

// @ts-expect-error
namespace MyApp {
  // ❌ same error
  export const greeting = 'hello';
}

// 3. parameter properties on constructors (emit assignments)

class UserShorthand {
  // @ts-expect-error
  constructor(public name: string) {} // ❌ same error
}

// 4. `import =` / `export =` (CommonJS interop forms — also banned, not shown
//    here because they require special module setup)

// ---------------------------------------------------------------------------
// Erasable alternatives
// ---------------------------------------------------------------------------

// Replace enum with an `as const` object + lookup type:

const Status = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
type Status = (typeof Status)[keyof typeof Status];

const current: Status = Status.Active;
console.log(current);

// Replace parameter properties with explicit field declarations:

class UserExplicit {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

console.log(new UserExplicit('Alice', 30));
console.log(Color, MyApp, UserShorthand);
