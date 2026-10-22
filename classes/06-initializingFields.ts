// =============================================================================
// Initializing Class Fields
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#--strictpropertyinitialization

// A field that nothing ever sets is `undefined` at runtime, while its type says
// `string`. Under `strict`, TypeScript requires every declared field to be
// initialized in its declaration or in the constructor.
//
// The flag behind this, `strictPropertyInitialization`, is taught on its own in
// ../flags/04-strictPropertyInitialization/index.ts.

export class CacheEntry {
  // @ts-expect-error
  key: string; // Error: Property 'key' has no initializer and is not definitely assigned in the constructor.

  // `!` (definite assignment assertion) says "something else sets this before it
  // is read" — the compiler takes your word, so use it only when that is true:
  ttlSeconds!: number;
}

const entry = new CacheEntry();

entry.key = 'session:user:42';
entry.ttlSeconds = 3600;
