// =============================================================================
// Migrating a tsconfig to TypeScript 7
// =============================================================================

// The type system did not change in TypeScript 7 — it is the same checker,
// rewritten in Go (roughly 10x faster on a full build). Almost every upgrade
// failure is a CONFIG failure, not a types failure.
//
// Every code below was produced by tsc 7.0.2 on a real config.

// -----------------------------------------------------------------------------
// Removed — tsc refuses to start
// -----------------------------------------------------------------------------
//
//   "target": "es5"                 TS5108   →  "ES2015" or later
//   "downlevelIteration": true      TS5102   →  delete it (ES5-only feature)
//   "module": "amd"                 TS5108   →  "esnext" | "preserve" | "commonjs"
//   "module": "umd"                 TS5108   →  same
//   "module": "system"              TS5108   →  same
//   "moduleResolution": "node"      TS5108   →  "bundler" | "nodenext"
//   "moduleResolution": "node10"    TS5108   →  same
//   "moduleResolution": "classic"   TS5108   →  same
//   "baseUrl": "."                  TS5102   →  inline the prefix into `paths`
//
// `baseUrl` is the fiddly one. Before:
//
//   { "baseUrl": "./src", "paths": { "@utils/*": ["utils/*"] } }
//
// After:
//
//   { "paths": { "@utils/*": ["./src/utils/*"] } }

// -----------------------------------------------------------------------------
// Changed defaults — these bite silently
// -----------------------------------------------------------------------------
//
//   strict              now ON   (see lesson 01)
//   moduleResolution    now defaults to `bundler`
//
// Set `moduleResolution` explicitly BEFORE you upgrade. A config that leaves it
// out inherits a default, and the defaults it might have been inheriting —
// `classic` and `node10` — are both on the removed list above. Setting it is a
// one-line change on 6 that turns a possible upgrade failure into a no-op.

// -----------------------------------------------------------------------------
// The order that works
// -----------------------------------------------------------------------------
//
// 1. On TypeScript 6, set `moduleResolution` and `target` explicitly.
// 2. On TypeScript 6, fix everything `--stableTypeOrdering` reports. It matches
//    6's type ordering to 7's deterministic one, so the diff you see is the
//    diff you would get from the upgrade.
// 3. Delete the removed options.
// 4. Bump to 7 and run the build. What is left is genuinely new.

// -----------------------------------------------------------------------------
// What is not ready yet (as of TypeScript 7.0.2)
// -----------------------------------------------------------------------------
//
// - The stable programmatic API is 7.1, not 7.0. Anything importing
//   `typescript` to walk an AST — codemods, custom lint rules, doc generators —
//   should stay on 6 until then.
// - typescript-eslint caps its peer dependency at `typescript <6.1.0`, at
//   8.68.0. If you lint with it, that is a hard blocker, and it is why the
//   other branches of this workshop are still on 6.
//
// Check both before scheduling the upgrade. The compiler being ready is not the
// same as your toolchain being ready.

export {};
