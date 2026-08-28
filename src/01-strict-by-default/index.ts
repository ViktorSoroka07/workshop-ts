// =============================================================================
// `strict` is on by default
// =============================================================================

// Look at this lesson's tsconfig.json: it sets no flags at all. It extends the
// shared base, which sets a target and a module system and nothing about type
// strictness.
//
// Under TypeScript 6 and every version before it, this file compiled clean.
// Under TypeScript 7 it does not — strict mode is the default now.

// @ts-expect-error TS7006: Parameter 'value' implicitly has an 'any' type.
export function double(value) {
  return value * 2;
}

// @ts-expect-error TS2322: Type 'null' is not assignable to type 'string'.
export const label: string = null;

// The markers above are the assertion. If TypeScript ever stopped reporting
// these two errors, each marker would itself become an error (TS2578, unused
// directive) and this lesson would fail to compile. Try deleting one and
// running `npx tsc -p src/01-strict-by-default`.
//
// Note the trap: a comment line that BEGINS with the directive text is a
// directive, wherever it appears. Writing about it in prose at the start of a
// line silently adds one.

// -----------------------------------------------------------------------------
// What this means for an existing project
// -----------------------------------------------------------------------------
//
// - `"strict": true` in your tsconfig is now a no-op. You can delete it.
// - A project that never turned strict on will not compile on 7 until it is
//   annotated. There is no `"strict": false` shortcut back — opt out of the
//   individual flags instead:
//
//     { "compilerOptions": { "noImplicitAny": false, "strictNullChecks": false } }
//
//   Treat that as a migration step with an end date, not a setting.
