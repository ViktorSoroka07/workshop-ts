## TypeScript 7 — The Native Compiler

TypeScript 7 (GA July 2026) is the compiler ported to Go. The headline is speed
— roughly 10x on a full build — but the part that costs you a day is the
configuration surface. Most of that moved in TypeScript 6.0, which changed the
defaults and deprecated old options; 7 keeps the defaults and removes the
options.

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

| #   | Topic                                                        |
| --- | ------------------------------------------------------------ |
| 01  | `strict` is on by default (since 6.0) — and what that breaks |
| 02  | The `module` keyword is gone (since 6.0); `namespace` stays  |
| 03  | Migrating a tsconfig: removed options, changed defaults      |

### The short version

- `strict` is the default since 6.0, and 7 keeps it. `"strict": true` is a
  no-op; `"strict": false` still turns it off.
- `target: es5`, `downlevelIteration`, `module: amd/umd/system`,
  `moduleResolution: node/node10/classic` and `baseUrl` are **removed** — the
  compiler refuses to start. On 6 they are deprecated: an error that
  `"ignoreDeprecations": "6.0"` silences; 7 refuses them even with it.
- `module Foo {}` is a grammar error since 6.0; write `namespace Foo {}`.
- `moduleResolution` defaults to `bundler` since 6.0; 5 used `node10` or
  `classic`, both removed in 7. Coming from 5, set it explicitly before you
  upgrade.
- The stable programmatic API is **7.1**, not 7.0.
