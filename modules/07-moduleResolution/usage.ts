// =============================================================================
// Module Resolution
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/modules/theory.html#module-resolution

// `import … from 'X'` names a string. Module resolution is how TypeScript turns that
// string into a file. The `moduleResolution` option in tsconfig.json picks the algorithm,
// and `module` says what kind of output follows from it.

// A folder import: './User' is not a file, so the resolver falls back to the folder's index.ts.
import { renderUser } from './User';

console.log(
  renderUser({ firstName: 'Jane', lastName: 'Doe', className: 'badge' })
); // <div class="badge">Jane Doe</div>

// ---------------------------------------------------------------------------
// What happens to `'./User'` and to `'pricing-kit'`
// ---------------------------------------------------------------------------
//
//   './User'  (starts with ./ or ../, a path)         'pricing-kit'  (a bare name, a package)
//        |                                                  |
//        v                                                  v
//   ./User.ts, ./User.tsx, ./User.d.ts?              paths in tsconfig.json match it?  -> use that file
//        | no                                               | no
//        v                                                  v
//   ./User/index.ts  (found: the barrel)             node_modules/pricing-kit/package.json
//                                                      "exports" (modern modes)  or  "types" / "main" (Node10)
//
// 🧪 Try it: `npx tsc -p modules --traceResolution | grep -A12 "Resolving module './User'"`
// prints every file TypeScript tried, in order, and the one it settled on.

// ---------------------------------------------------------------------------
// The strategies
// ---------------------------------------------------------------------------

// "Bundler" -- code that Vite, webpack, esbuild or Next.js bundles (this folder):
//   "module": "ESNext", "moduleResolution": "Bundler"
//   - extensionless relative imports and folder imports work, as above
//   - reads package.json "exports", honours `paths`
//
// "NodeNext" -- code Node.js runs itself (libraries, CLIs, servers). Node16 is a snapshot
// of the same rules; NodeNext follows the latest Node behaviour.
//   "module": "NodeNext", "moduleResolution": "NodeNext"
//   - the file's own package.json decides whether it is ESM ("type": "module") or CommonJS
//   - in ESM files a relative import needs its extension, and a folder import does not work
//   - the extension is the OUTPUT one: write './renderUser.js' for the file renderUser.ts,
//     because TypeScript does not rewrite paths and Node will run the .js
//
// "Node10" -- the old Node algorithm. Deprecated in TypeScript 6 and an error in 7
// (../../flags/20-removed-in-typescript-7/index.ts). Avoid it in new projects.

// ⚠️ Gotcha: the same two lines compile under Bundler and fail under NodeNext
// (checked on a copy of this folder with
// "module": "NodeNext", "moduleResolution": "NodeNext" and a package.json saying "type": "module"):
//   import { renderUser } from './User';
//     Error: Relative import paths need explicit file extensions in ECMAScript imports
//     when '--moduleResolution' is 'node16' or 'nodenext'. Consider adding an extension to the import path.
//   import { renderUser } from './User/renderUser';
//     Error: … Did you mean './User/renderUser.js'?
// The fix is './User/index.js' and './User/renderUser.js'.
//
// 🧪 Try it: from the repository root, compile a scratch copy as an ES module under NodeNext;
// it reports TS2834 on the `./User` import:
//   d=$(mktemp -d) && cp -r modules/07-moduleResolution/. $d && echo '{"type":"module"}' > $d/package.json
//   npx tsc --noEmit --module nodenext --moduleResolution nodenext $d/usage.ts

// ✅ Best practice: pick the strategy by who runs the output, not by habit.
// A bundler runs it: Bundler. Node runs it: NodeNext. Set `moduleResolution` explicitly.

// ---------------------------------------------------------------------------
// 🎓 On your own: package.json "exports"
// ---------------------------------------------------------------------------

// Harder because it needs a package on disk, so this one is a story, checked on a scratch copy.
// A package can list the entry points it allows in its package.json:
//
//   "exports": { ".": "./dist/index.js", "./tax": "./dist/tax.js" }
//
//   import { total } from 'pricing-kit';                    // ".": allowed in Bundler and NodeNext
//   import { vat } from 'pricing-kit/tax';                  // "./tax": allowed
//   import { secret } from 'pricing-kit/dist/internal';     // not listed
//     Bundler and NodeNext: Error: Cannot find module 'pricing-kit/dist/internal' or its corresponding type declarations.
//     Node10 compiles it -- it ignores "exports" and reaches into the package's folders.
//
// Under Node10 the first two lines fail instead: it cannot see "exports" at all
//   Error: Cannot find module 'pricing-kit' or its corresponding type declarations.
//     There are types at '…/node_modules/pricing-kit/dist/index.d.ts', but this result could not be
//     resolved under your current 'moduleResolution' setting. Consider updating to 'node16', 'nodenext', or 'bundler'.

// ---------------------------------------------------------------------------
// "Cannot find module": where to look
// ---------------------------------------------------------------------------

// 1. Is `moduleResolution` right for how the code runs?
// 2. NodeNext: is the `.js` extension there?
// 3. A package: does "exports" list that path, and does it ship types?
// 4. An alias: is it in `paths`? (previous lesson)
// 5. Restart the TypeScript server in the editor -- it caches resolution results.
