// =============================================================================
// Path Aliases
// =============================================================================
// https://www.typescriptlang.org/tsconfig#paths

// Deep in a project, relative imports turn into `../../../utils`, and they break
// when a file moves. `paths` in tsconfig.json gives a folder a short prefix.
// This folder's tsconfig.json maps `@app/*` to `./*`, relative to the tsconfig:
//
//   "compilerOptions": { "paths": { "@app/*": ["./*"] } }

// Alias imports, the same from any depth:
import type { UserDto, ShapeWithClassName } from '@app/types';
import { getUsername } from '@app/utils';

// What the relative form would look like from this file:
//   import type { UserDto } from '../types';
//   import { getUsername } from '../utils';

function renderUserCard(user: UserDto, className?: string): string {
  const props: ShapeWithClassName<{ name: string }> = {
    name: getUsername(user),
    className,
  };

  return `<div class="${props.className ?? ''}">${props.name}</div>`;
}

console.log(renderUserCard({ firstName: 'Jane', lastName: 'Doe' }, 'card')); // <div class="card">Jane Doe</div>

// An alias that no `paths` entry matches is looked up as an npm package:
// @ts-expect-error
import type { Invoice } from '@billing/types'; // Error: Cannot find module '@billing/types' or its corresponding type declarations.

// ---------------------------------------------------------------------------
// ⚠️ Gotcha: `paths` only teaches the type checker
// ---------------------------------------------------------------------------

// TypeScript resolves `@app/utils` to check types, then emits the import string unchanged:
//
//   const utils_1 = require("@app/utils");   // compiled CommonJS output
//
// Run that in node and it fails with "Cannot find module '@app/utils'".
// Whatever runs or bundles the code needs the same mapping:
//   - Vite, webpack, Rollup: an `alias` / `resolve.alias` entry in the bundler config
//   - Jest, Vitest: `moduleNameMapper` / `resolve.alias`
//   - node running TypeScript directly: `imports` in package.json (`"#app/*"`) instead of `paths`
// Some bundlers can read `paths` from tsconfig.json for you; check that yours does.

// 🧪 Try it: compile this folder to JavaScript and open the output -- the string
// '@app/utils' is still there.

// ✅ Best practice: one alias for the source root (`@app/*` or `@/*` -> `./src/*`)
// rather than one per folder; every extra alias is another place to keep in sync
// with the bundler and the test runner.

// ⚠️ Gotcha: `@app/…` looks exactly like an npm scope (`@types/node`). If a package
// with that scope exists, the two compete. Pick a prefix no package you install uses.
