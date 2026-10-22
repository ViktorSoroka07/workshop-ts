// =============================================================================
// When to Use Namespaces Today
// =============================================================================

// Rarely. Two situations are left.
//
// 1. Describing a global that a plain <script> tag created. A `declare namespace` is
//    ambient: it says "this object exists at runtime" and emits no code. This is what
//    global `.d.ts` files for older libraries contain.
declare namespace AnalyticsSdk {
  const version: string;
  function track(eventName: string, payload?: object): void;
}

function trackSignup() {
  AnalyticsSdk.track('signup', { plan: 'free' });

  // @ts-expect-error
  AnalyticsSdk.track(42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'.
}

// 2. Reading and maintaining an older codebase that already uses them (files 01-06).
//
// Everything else belongs in modules (../modules/01-namedExports/):
//   - a module has its own scope; a namespace adds to the one global scope, where two
//     libraries can claim the same name
//   - a module says what it needs with `import`; a namespace needs `/// <reference>`
//     lines and a hand-ordered `outFile` (file 05-)
//   - bundlers, Node and the browser understand modules; a namespace is TypeScript-only
//     syntax that emits an object builder
//
// ✅ Best practice: new code uses ES modules. A namespace that holds values is rejected
// by `erasableSyntaxOnly`, taught in ../flags/18-erasableSyntaxOnly/index.ts.
