## Compiler Flags

Walkthrough of the most useful TypeScript compiler flags for type safety and project hygiene.

Each lesson is a self-contained folder under `src/`. Each folder has:

- `index.ts` — example code with `@ts-expect-error` markers showing what the flag catches
- `tsconfig.json` — extends the shared base, enables only the flag(s) for that lesson

### Run

```sh
npm run check                  # type-check every lesson in turn
npx tsc -p src/01-strict       # type-check a single lesson
```

### Lessons

| #   | Flag                                             |
| --- | ------------------------------------------------ |
| 01  | `strict`                                         |
| 02  | `strictNullChecks`                               |
| 03  | `noImplicitAny`                                  |
| 04  | `strictPropertyInitialization`                   |
| 05  | `strictFunctionTypes`                            |
| 06  | `noUncheckedIndexedAccess`                       |
| 07  | `noImplicitReturns`                              |
| 08  | `exactOptionalPropertyTypes`                     |
| 09  | `useUnknownInCatchVariables`                     |
| 10  | `noFallthroughCasesInSwitch`                     |
| 11  | `strictBindCallApply`                            |
| 12  | `noImplicitThis`                                 |
| 13  | `forceConsistentCasingInFileNames`               |
| 14  | `noUnusedLocals` + `noUnusedParameters`          |
| 15  | `noUncheckedSideEffectImports`                   |
| 16  | `allowUnreachableCode`                           |
| 17  | `verbatimModuleSyntax`                           |
| 18  | `erasableSyntaxOnly`                             |
| 19  | JS interop: `allowJs`, `checkJs`, `// @ts-check` |
| 20  | Options removed in TypeScript 7                  |

### A note on versions

This branch pins **TypeScript 6**. TypeScript 7 turns `strict` on by default and
removes a set of older options — lesson 20 lists them, and lesson 01 shows what
changes for `strict` itself.

The workshop cannot move to 7 yet: `typescript-eslint` still caps its peer
dependency at `typescript <6.1.0`, so upgrading would break `npm run lint`. The
`native-compiler` branch covers TypeScript 7 on its own, without eslint.
