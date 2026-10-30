export * from './auth';
// @ts-expect-error
export * from './billing'; // Error: Module './auth' has already exported a member named 'Config'. Consider explicitly re-exporting to resolve the ambiguity.

// Fix: name each one. Both stay reachable, under different names:
//   export type { Config as AuthConfig } from './auth';
//   export type { Config as BillingConfig } from './billing';
//
// In JavaScript the barrel itself loads without an error; the clash bites whoever imports
// the name. (Interfaces vanish at runtime, so picture two values, a `TIMEOUT` in each file.)
// Under ES modules, `import { TIMEOUT } from './index'` crashes node at startup:
//   SyntaxError: The requested module './index' contains conflicting star exports for name 'TIMEOUT'
// Transpiled to CommonJS, there is no crash: the first `export *` quietly wins, and the
// app runs with the wrong `TIMEOUT`. Catch it here, at compile time.
