export * from './auth';
// @ts-expect-error
export * from './billing'; // Error: Module './auth' has already exported a member named 'Config'. Consider explicitly re-exporting to resolve the ambiguity.

// Fix: name each one. Both stay reachable, under different names:
//   export { Config as AuthConfig } from './auth';
//   export { Config as BillingConfig } from './billing';
//
// TypeScript stops it here, before anything runs. If that error is ignored, the emitted
// JavaScript meets the clash at runtime, and the barrel itself loads without an error; the
// clash bites whoever imports the name. (Interfaces vanish at runtime, so picture two
// values, a `TIMEOUT` in each file.)
// Node running ES modules crashes at startup on `import { TIMEOUT } from './index'`:
//   SyntaxError: The requested module './index' contains conflicting star exports for name 'TIMEOUT'
// Node running CommonJS does not crash: the first `export *` quietly wins, and the app
// runs with the wrong `TIMEOUT`. Catch it here, at compile time.
