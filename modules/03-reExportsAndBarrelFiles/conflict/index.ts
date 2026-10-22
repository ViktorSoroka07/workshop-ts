export * from './auth';
// @ts-expect-error
export * from './billing'; // Error: Module './auth' has already exported a member named 'Config'. Consider explicitly re-exporting to resolve the ambiguity.

// Fix: name each one. Both stay reachable, under different names:
//   export type { Config as AuthConfig } from './auth';
//   export type { Config as BillingConfig } from './billing';
//
// In JavaScript the same clash is not an error at the barrel: an engine running
// ES modules treats the name as ambiguous and refuses to import it. Transpiled to
// CommonJS, the first `export *` quietly wins. Catch it here, at compile time.
