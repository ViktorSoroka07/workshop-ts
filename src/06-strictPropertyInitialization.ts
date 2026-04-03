// =============================================================================
// strictPropertyInitialization
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#--strictpropertyinitialization

// With `strict` mode (or `strictPropertyInitialization` + `strictNullChecks`),
// TypeScript requires every declared class property to be initialized either
// in its declaration or in the constructor.
// This catches a common source of runtime `undefined` bugs at compile time.

export class CacheEntry {
  // @ts-expect-error
  key: string; // Error: Property 'key' has no initializer and is not definitely assigned in the constructor.
}

const entry = new CacheEntry();

entry.key = 'session:user:42';
