# How to read the lessons

Every lesson is a TypeScript file where the comments are the lesson: each one sits beside
the code it explains. This page explains the few conventions the files share, so the files
themselves can start with the lesson.

## Markers

A comment that starts with one of these four labels is a marker. Nothing else uses them.

| Marker              | Meaning                                                         |
| ------------------- | --------------------------------------------------------------- |
| `✅ Best practice:` | what most real-world projects do                                |
| `⚠️ Gotcha:`        | where TypeScript (or JavaScript) surprises people               |
| `🧪 Try it:`        | an experiment to run live: change the code and watch the editor |
| `🎓 On your own:`   | a harder example we skip in the room; study it afterwards       |

A `🎓` comment always opens with one line saying why the example is harder.

## Lines that fail and lines that work

A line that the compiler rejects carries the first line of the compiler's message, as
TypeScript 6 prints it. A line that compiles says `OK`:

```ts
let attempts: number = 3; // OK

// @ts-expect-error
attempts = 'three'; // Error: Type 'string' is not assignable to type 'number'.
```

The part after `Error:` is real compiler output, so you can search for it. Where the plain
reason helps, it follows in parentheses.

## `@ts-expect-error` and `@ts-ignore`

The lessons have to contain lines that do not compile, and the project still has to
type-check cleanly. Two comments make that possible. Both silence the error on the **next
line**:

- `// @ts-ignore` silences it, and says nothing if there is no error to silence. After a
  refactor the line may be perfectly valid and the comment stays behind, hiding the next
  real mistake on that line.
- `// @ts-expect-error` silences it **and fails if there is no error**:

  ```ts
  // @ts-expect-error   <- Error: Unused '@ts-expect-error' directive.
  const ready: boolean = true;
  ```

  The comment is a claim that the next line is wrong. When the claim stops being true, the
  compiler tells you.

✅ Best practice: use `@ts-expect-error`, with a reason, wherever you must silence an error.
Keep `@ts-ignore` for the rare error that is reported before the file is even checked
(the flags topic has one, in `forceConsistentCasingInFileNames`).

Each lesson's failing lines use `@ts-expect-error`, and `npm run check` also compares every
`// Error:` and `// type:` comment with what TypeScript prints, so it fails the moment a
lesson stops teaching what it says.

## Files that are scripts

A file without a top-level `import` or `export` is a script: its names live in one global
scope shared with every other script in the same folder and with the browser's globals.
The `types` and `namespaces` lessons are scripts (most of the other topics add `export {}` or
imports to avoid this), so a name declared in one file can be used
in the next, and two files cannot declare the same name. The `modules` topic explains the
alternative.

## Running the lessons

```sh
npm install
npm run check          # type-check every topic
npx tsc -p types       # type-check one topic (flags: npx tsc -p flags/01-strict)
npm run lint
```

The first lesson is [`../types/01-primitives.ts`](../types/01-primitives.ts).
