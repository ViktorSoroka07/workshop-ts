// =============================================================================
// Path Aliases
// =============================================================================
// https://www.typescriptlang.org/tsconfig#paths

// As projects grow, relative imports get unwieldy (`../../../types`).
// Path aliases map a short prefix to a directory, configured in tsconfig.json.
// This project uses `@app/*` → `./src/*`.

// These imports use the @app/* alias instead of relative paths:
import type { UserDto, ShapeWithClassName } from '@app/types';
import { getUsername } from '@app/utils';

// Equivalent relative imports (what you'd write without aliases):
//   import type { UserDto, ShapeWithClassName } from './types';
//   import { getUsername } from './utils/getUserName';

function renderUserCard(user: UserDto, className?: string): string {
  const props: ShapeWithClassName<{ name: string }> = {
    name: getUsername(user),
    className,
  };

  return `<div class="${props.className ?? ''}">${props.name}</div>`;
}

console.log(renderUserCard({ firstName: 'Jane', lastName: 'Doe' }, 'card'));

// ---------------------------------------------------------------------------
// tsconfig.json configuration
// ---------------------------------------------------------------------------
//
// {
//   "compilerOptions": {
//     "paths": {
//       "@app/*": ["./src/*"]
//     }
//   }
// }
//
// `paths` is compile-time only — TypeScript resolves `@app/types` for
// type-checking, but the emitted .js still contains `@app/types`. Your bundler
// or runtime must also understand the alias, or you get "module not found":
//
// - Vite / webpack / Rollup: configure the same alias in bundler config.
// - Jest: use `moduleNameMapper` in jest.config.
// - Node.js: use a loader like `tsconfig-paths`.

// Common alias conventions:
//   "@app/*"  → "./src/*"          (generic, used here)
//   "@/*"     → "./src/*"          (shorter, popular in Vue/Nuxt)
//   "@test/*" → "./test/*"         (test utilities)
//
// Using `@` prefix can't conflict with npm packages (@scope/name requires
// a slash, @scope alone is not valid). It's visually distinct from relative paths.

// A single `@app/*` alias usually strikes the best balance — eliminates the
// `../../../` problem without creating a mapping maze across multiple tools.

export {};
