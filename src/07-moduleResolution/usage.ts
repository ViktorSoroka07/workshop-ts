// =============================================================================
// Module Resolution
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/modules/theory.html#module-resolution

// When you write `import { User } from './components'`, TypeScript needs to
// figure out which FILE that refers to. The `moduleResolution` tsconfig setting
// controls the algorithm.

// ---------------------------------------------------------------------------
// The three strategies you'll encounter
// ---------------------------------------------------------------------------

// "Bundler" — use for web apps (Vite, Next.js, webpack)
//   - No file extensions needed in imports
//   - Supports path aliases, barrel files
//   - Supports package.json "exports"
//   tsconfig: "module": "ESNext", "moduleResolution": "Bundler"

// "NodeNext" — use for Node.js projects (libraries, CLI tools)
//   - Requires .js extensions in relative imports (even for .ts files!)
//       import { User } from './User.js';   // .js, not .ts
//   - Why? TS doesn't rewrite paths — the output is .js, so the import must match.
//   tsconfig: "module": "NodeNext", "moduleResolution": "NodeNext"

// "Node10" — legacy, avoid for new projects
//   - Ignores package.json "exports", can't resolve modern ESM packages.

// ---------------------------------------------------------------------------
// How resolution works step by step (Bundler mode)
// ---------------------------------------------------------------------------
//
// Given: import { getUsername } from '@app/utils'
//
// 1. Check tsconfig paths → @app/* maps to ./src/*
//    Resolved: ./src/utils
//
// 2. Try exact file: ./src/utils.ts → not found
//
// 3. Try directory index: ./src/utils/index.ts → found ✅
//    Contains: export * from './getUserName'
//    → resolves ./src/utils/getUserName.ts → exports getUsername ✅

// ---------------------------------------------------------------------------
// Quick troubleshooting: "Module not found"
// ---------------------------------------------------------------------------
//
// 1. Is moduleResolution correct for your setup? (Bundler vs NodeNext)
// 2. Missing .js extension? (NodeNext requires them)
// 3. Does the package expose that path in "exports"?
// 4. tsconfig paths — is the alias mapped correctly?
// 5. Restart the TS language server — it caches resolution results.

// A file without any import/export is treated as a script (global scope),
// not a module. Adding `export {}` is enough to make it a module.
export {};
