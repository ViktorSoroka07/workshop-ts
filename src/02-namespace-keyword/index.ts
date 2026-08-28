// =============================================================================
// The `module` keyword is gone; `namespace` stays
// =============================================================================

// Namespaces still exist in TypeScript 7. What was removed is the older way of
// spelling one — `module Foo { }` — which is now a grammar error:
//
//   module Legacy {
//     export const value = 1;
//   }
//
//   error TS1540: A 'namespace' declaration should not be declared using the
//                 'module' keyword. Please use the 'namespace' keyword instead.
//
// It is left commented out above because TS1540 is a grammar error: unlike a
// type error, `@ts-expect-error` cannot swallow it, so a single uncommented
// line would stop this whole lesson compiling.

export namespace Modern {
  export const value = 1;
}

// -----------------------------------------------------------------------------
// Should you write namespaces at all?
// -----------------------------------------------------------------------------
//
// In new code: no. ES modules do the same job, and bundlers understand them.
// You still need to READ namespaces, because they are everywhere in `.d.ts`
// files and in code written before 2015 — which is the reason the `namespaces`
// branch of this workshop exists.
//
// The migration is mechanical: `module X {` becomes `namespace X {`. A
// find-and-replace across the repo is usually the whole job.
