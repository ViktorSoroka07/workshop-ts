// =============================================================================
// Named Exports and Imports
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#es-module-syntax

// Each file is its own module with its own scope — nothing leaks into the global
// namespace unless explicitly exported. Named exports let you export multiple
// values from a single module. Consumers import exactly what they need by name,
// which is great for tree-shaking.

// Style 1: inline `export` on declarations (most common in practice)
export const API_VERSION = 'v2';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface RequestConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

export function buildUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

// Style 2: export list at the bottom — useful when you want all exports in one place
const DEFAULT_TIMEOUT = 5000;
const MAX_RETRIES = 3;

function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  return fn().catch((err) => {
    if (retries <= 0) throw err;
    return withRetry(fn, retries - 1);
  });
}

export { DEFAULT_TIMEOUT, MAX_RETRIES, withRetry };

// You can also rename on export to avoid naming conflicts:
export { DEFAULT_TIMEOUT as TIMEOUT, withRetry as retry };
