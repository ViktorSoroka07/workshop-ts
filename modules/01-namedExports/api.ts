// =============================================================================
// Named Exports and Imports
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#es-module-syntax
//
// The ✅ / ⚠️ / 🧪 / 🎓 markers, the `// Error:` comments and `@ts-expect-error` are explained in ../../intro/03-howToReadTheLessons.md.

// A file with a top-level `import` or `export` is a module: its names are private to
// the file until exported (a file with neither is a script -- see ../../types/ for those).
// Named exports let one module hand out several values; consumers import them by name.

// Style 1: `export` in front of the declaration.
// ✅ Best practice: the form most projects use -- the export is visible right where it is declared.
export const API_VERSION = 'v2';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export function buildUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

// Style 2: an export list. Declarations without `export` stay private:
const DEFAULT_TIMEOUT = 5000; // 5 seconds, in milliseconds
const MAX_RETRIES = 3;
const INTERNAL_API_KEY = 'sk_live_not_for_consumers';

function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  return fn().catch((err) => {
    if (retries <= 0) throw err;

    return withRetry(fn, retries - 1);
  });
}

export { DEFAULT_TIMEOUT, MAX_RETRIES, withRetry };

// `as` renames on the way out. The same binding is now reachable under two names:
export { DEFAULT_TIMEOUT as TIMEOUT };
