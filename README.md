## TypeScript 7 — The Native Compiler

TypeScript 7 (GA July 2026) is the compiler ported to Go. The headline is speed
— roughly 10x on a full build — but the part that costs you a day is the
configuration surface, which changed underneath.

The type system did not change. Everything the other branches of this workshop
teach means exactly what it meant on TypeScript 5 and 6.

### Run

```sh
npm install
npm run check                          # type-check every lesson in turn
npx tsc -p src/01-strict-by-default    # type-check a single lesson
```

This branch is the only one pinned to **TypeScript 7**, and the only one with
no eslint: `typescript-eslint` still caps its peer dependency at
`typescript <6.1.0`, so a branch that lints cannot run 7 yet.

### Lessons

| #   | Topic                                                   |
| --- | ------------------------------------------------------- |
| 01  | `strict` is on by default — and what that breaks        |
| 02  | The `module` keyword is gone; `namespace` stays         |
| 03  | Migrating a tsconfig: removed options, changed defaults |

### The short version

- `strict` is the default. `"strict": true` is now a no-op.
- `target: es5`, `downlevelIteration`, `module: amd/umd/system`,
  `moduleResolution: node/node10/classic` and `baseUrl` are **removed** — the
  compiler refuses to start, it does not warn.
- `module Foo {}` is a grammar error; write `namespace Foo {}`.
- `moduleResolution` now defaults to `bundler`. Set it explicitly before you
  upgrade, because the defaults you might have been inheriting were removed.
- The stable programmatic API is **7.1**, not 7.0.
