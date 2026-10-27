# Maintaining the TypeScript workshop

This file records how the material is written and checked, what was learned while reworking
the `types` folder, and the layout of the repository.

## Layout

One folder per topic (types, classes, flags, generics, modules, namespaces, satisfies), each
with its own `tsconfig.json` extending `../tsconfig.base.json` (`strict: false`, see "Base
config"; flags' subfolders reach it as `../../`). `native-compiler` stays a branch. Point to
another topic by relative path (`../flags/09-noUncheckedIndexedAccess/index.ts`). From a lesson inside a subfolder (modules, flags) it is `../../`. `types` is in teaching order:
primitives, let/const, object/arrays/tuples, aliases/interfaces, index signatures, function
types, ... `@stylistic/padding-line-between-statements` runs at the root.

Root scripts: `npm run check` (tsc -p over every topic tsconfig), `check:comments` (every
`// type:` and `// Error:` against TS 6; takes tsconfig paths, `types` still fails it), `lint`,
`format:check`, `build:outfile` (namespaces). generics' `reset.d.ts` must stay inside `generics/`;
namespaces' `outFile` build is rejected by TS 7, so the root stays on TypeScript 6.x.

## How a lesson is written

- **The comments are the lesson.** Each sits beside the code it explains. A short intro,
  no "real-world example" section for something the code above already shows.
- **No concept before the section that introduces it.** An incidental use is replaced
  with something already taught (the example often improves: `string[]` instead of
  `unknown` made the inferred callback parameter usable). Where the topic depends on a
  later concept, give a one-line meaning and a pointer. Put a concept where it is first
  _used_, not where its category is -- and if a group belongs together (`any`, `unknown`,
  `never`), split each into "what it is" (in the group) and "how to use it" (where its
  prerequisites exist).
- **Topics introduce, they don't duplicate.** A topic may introduce what another builds
  on; it oversteps when it teaches another topic's subject (here: a tsconfig flag).
- **Show, don't state.** Each rule gets a line that visibly bites (`@ts-expect-error`
  with the real message) or a hover/`// type:` the presenter can show live. A runtime
  claim gets the value node prints.
- **Open with why and when.** A lesson says what the feature buys and when to reach for it
  before it says how it works. A list of cases ("three modifiers", "call, apply, bind")
  gets code for every item, not only the ones that are easy to show.
- **A convention carries its boundary.** Advice such as a `_` prefix or "use `!`" says
  where it stops, and the example beside it shows the case that does not need it.
- **Error comments quote the compiler.** A line that fails says `// Error: <first line of
the TS 6 message>` (a trailing `-- reason` is fine); one that compiles says `// OK`. Never
  ✅/❌ for that: those marks belong to the markers below. `@ts-expect-error` stays on the
  line above.
- **Markers**, explained once in `intro/03-howToReadTheLessons.md` (the lesson files do not
  repeat or point to it), used for every such line and nothing else:
  `✅ Best practice:` (what real projects do), `⚠️ Gotcha:` (what surprises people),
  `🧪 Try it:` (a live experiment), `🎓 On your own:` (a harder example the presenter skips;
  students study it afterwards, so it opens with one line saying why it is harder). Four is
  the limit; more stop standing out.
- **Quoting a long message:** a multi-line compiler message is quoted by its first line; put
  the `// Error:` comment beside the line the compiler reports, which for a multi-line
  literal is the opening line, so `@ts-expect-error` goes above the statement's first line.
  Quote what TS 6 prints; TS 7 prints unions sorted and sometimes reports a missing property
  (TS2741) where TS 6 reports the argument (TS2345).
- **Pointing within a topic:** a pointer to a later lesson of the same topic is fine when it
  carries a one-line meaning; pointing to a later _topic_ needs the meaning and a path.
- **Name a rule by what decides it, not by its common case** ("`void` on the function
  itself vs in a function type", not "vs in a callback").
- **Names describe the domain** (`analyticsId`, `createAccount`), never `a`, `b`, `foo`;
  idiomatic comparator parameters `(a, b) => a - b` are the exception.
- **Give big numbers a human size**: bytes as petabytes, timestamps as dates.
- **Spacing**: a comment that starts a new thought gets a blank line above it; one that
  explains the line right above it (a fix, a printed type) stays attached. Code blocks
  are separated by a blank line.

## TypeScript facts this material relies on (checked on 6.0.2 and 7.0.2)

- TS 7.0 is the same checker ported to Go: identical diagnostics on this material. Visible
  differences: unions print sorted (`stableTypeOrdering`), the no-overload error names
  only the last overload, a hover drops "(+1 overload)", and TS 6's expandable hover
  prints `extends __type` for an interface extending an object-literal alias.
- TS 7.0 ships no JS API (planned for 7.1); typescript-eslint supports `<6.1`, so the
  repo stays on 6.x until tools catch up. `strict` is on by default since 6.0, not 7.
- TS 6 turns on by default (measured with an empty tsconfig on 6.0.2 and 7.0.2): `strict`
  and therefore every flag in it, and `noUncheckedSideEffectImports`. Not on by default:
  `noUncheckedIndexedAccess`, `noImplicitReturns`, `exactOptionalPropertyTypes`,
  `erasableSyntaxOnly`, `verbatimModuleSyntax`. TS 7 does not change these.
- Options deprecated in TS 6 (error TS5107, or TS5101 for `downlevelIteration`/`baseUrl`,
  silenced by `"ignoreDeprecations": "6.0"`) are removed in TS 7 (TS5108, TS5102). The
  `module Legacy {}` namespace spelling is an error (TS1540) on both.
- Under `import type`, a value used as a value is TS1361; an interface used as a value is
  TS2693. A plain import used only as a type is elided by `tsc` even without `type`; `type`
  matters for single-file transpilers and for the reader.
- ES modules reject an ambiguous `export *` clash at import time; transpiled CommonJS lets
  the first one win. TS reports the clash as TS2308.
- Inside `generics/`, `ts-reset` (`reset.d.ts`) makes `JSON.parse` return `unknown`, so that
  topic's lessons differ from the global fact above.
- Since TS 5.5 a guard with no return annotation and one narrowing expression gets `is`
  inferred; an explicit `: boolean` throws it away.
- `void` on the function itself means "returns nothing"; in a function type it means
  "return anything, callers can't use it" -- calling gives `void`.
- `filter`, `some`, `every` type their callback `=> unknown` (truthiness); `sort`'s is
  `(a, b) => number`.
- `JSON.parse` returns `any`; `: unknown` on its result changes the type.
- A string index signature accepts number keys (JS converts them to strings, per the
  handbook); a number signature rejects string keys.
- Numeric enums accept any `number` variable and double `Object.keys`; Node.js's
  type-stripping refuses enums ("not supported in strip-only mode").
- An over-precise number literal compiles; only the editor hints (TS80008).
- A failed `===` narrows nothing after an early return; `typeof` does, since it catches
  every member of the type.

## Base config

`tsconfig.base.json` sets `strict: false`. TypeScript 6 turns `strict` on when it is merely
absent, so without that line every flags lesson ran with all strict flags on and isolated
nothing. A flag that depends on another says so in its lesson and sets both in its tsconfig
(`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `strictPropertyInitialization`
need `strictNullChecks`).

Folders that need strictness set it themselves (`strict: true` in types, classes, generics,
modules, namespaces, satisfies); only flags leaves it off, so each lesson there turns on one
flag. A lesson that relies on another flag says so (the flags README lists the pairs).

## Script files and global scope

Files with no import/export are scripts: they share one global scope with each other
and with the DOM. A top-level name may not repeat one in another file or a browser
global (`status`, `name`, `event`, `stop`, `close`, `history`, ...). `interface Window`
merging only works in a script (with `export {}` it silently becomes a local
interface). Same-named interfaces anywhere in the scope merge silently.

## Verifying a change

1. `npx tsc -p . --noEmit` on 6.x (repo) and on 7.x (install `typescript@7` in a scratch
   folder, never into the tree), `npm run lint`, `npm run format:check`, and
   `npm run check:comments` for the topics you touched.
2. For a restructure: strip every `// @ts-expect-error` from a scratch copy, before and
   after, and diff the sorted `error TSxxxx: message` lists. Identical, plus only the
   errors you meant to add, proves every example still fails for the same reason.
3. Hover text comes from the language server, not memory: tsserver for 6
   (`quickinfo` with `verbosityLevel`), `tsc --lsp --stdio` for 7.
4. Read the full `git diff` of every file before staging it. An editor can save an
   older buffer over the file; staging the whole file once silently reverted an agreed
   fix. When the presenter has uncommitted edits in the same file, stage only your own
   change by content (rebuild the blob from `HEAD` and `git update-index`), not with a
   zero-context patch -- line anchors shift around their edits.
5. Never `rm -rf` (denied in global settings): write to a fresh scratch folder instead.

## Commits

One change per commit; the message says what is now true and why. A fix to an
unpushed commit is a `--fixup`, folded only when the presenter says so. No AI
attribution. Pushing is the presenter's act.
