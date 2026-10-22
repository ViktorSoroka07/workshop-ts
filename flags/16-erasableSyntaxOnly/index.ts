// =============================================================================
// erasableSyntaxOnly
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly

// Bans the TypeScript syntax that produces JavaScript of its own, so that deleting every
// type annotation leaves a program that already runs. NOT on by default and NOT part
// of `strict`.
//
// Why you want it:
//   - Node.js runs .ts files by removing the types (type stripping, on by default in
//     Node 24); it refuses syntax that needs to be turned into code
//   - type-strippers such as ts-blank-space do the same
//   - the TC39 "Type Annotations" proposal for JavaScript has the same shape
//
// In short: every TypeScript construct must be "the same JS, minus the types".

// ---------------------------------------------------------------------------
// What it bans
// ---------------------------------------------------------------------------

// 1. Enums (emit a runtime object). Alternative: ../../types/15-enumsVsLiteralUnions.ts
// @ts-expect-error
enum Color {
  // Error: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
  Red,
  Green,
  Blue,
}

// 2. Namespaces that contain values (emit an object builder). Alternative: a module,
//    ../../namespaces/07-namespacesToday.ts
// @ts-expect-error
namespace Billing {
  // Error: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
  export const currency = 'EUR';
}

// 3. Parameter properties (emit assignments in the constructor). Alternative:
//    ../../classes/04-parameterProperties.ts shows the long form
class AccountShorthand {
  // @ts-expect-error
  constructor(public name: string) {} // Error: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
}

// 4. `import x = require('x')` and `export = x`, the CommonJS-only forms (the same error;
//    not shown here because they need a CommonJS module setting).

// ---------------------------------------------------------------------------
// What stays allowed
// ---------------------------------------------------------------------------

// Anything that vanishes when the types are removed: annotations, interfaces, type
// aliases, generics, `abstract`, `declare enum`, and a namespace that holds only types:
namespace Shapes {
  export interface Point {
    x: number;
    y: number;
  }
}

const startPoint: Shapes.Point = { x: 0, y: 0 }; // OK

// The long form of a parameter property is plain JavaScript once the types are gone:
class AccountExplicit {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

console.log(startPoint, new AccountExplicit('Alice')); // { x: 0, y: 0 } AccountExplicit { name: 'Alice' }
console.log(Color, Billing, AccountShorthand);

// 🧪 Try it: copy a file with an `enum` to a scratch folder and run it with `node file.ts`.
// Node refuses with "SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is
// not supported in strip-only mode". With the enum replaced by a literal union, it runs.

// ✅ Best practice: switch it on when Node or a type-stripper runs your TypeScript
// directly; `tsc` then only checks (`noEmit`) and the runtime does the stripping.
