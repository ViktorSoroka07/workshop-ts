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
