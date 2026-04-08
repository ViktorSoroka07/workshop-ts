// =============================================================================
// Type-Only Imports and Exports
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export

// Types exist only at compile time and are erased from the emitted JavaScript.
// `import type` makes this explicit — guaranteeing no runtime import is emitted.

// Whole-statement type-only import — everything here is erased from the JS output:
import type { ApiResponse, RequestConfig } from './types';

// Inline type-only import (TypeScript 4.5+) — mix values and types in one import.
// `DEFAULT_HEADERS` stays in the JS output, `ApiResponse` is erased:
import { DEFAULT_HEADERS, type ApiResponse as InlineApiResponse } from './types';

// Using a type-only import for annotations is fine:
const response: ApiResponse<string> = { data: 'test', status: 200, message: 'OK' };

// But using it as a VALUE does not compile — it was erased:
// @ts-expect-error
const ResponseConstructor = ApiResponse; // Error: 'ApiResponse' cannot be used as a value
                                         // because it was imported using 'import type'.

// The inline-imported type works the same way:
const anotherResponse: InlineApiResponse<number> = { data: 42, status: 200, message: 'OK' };

// The runtime value import works as expected:
console.log(DEFAULT_HEADERS); // { 'Content-Type': 'application/json' }

function logResponse(res: ApiResponse<string>): void {
  console.log(`Status: ${res.status}, Message: ${res.message}`);
}

function logConfig(config: RequestConfig): void {
  console.log(`Base URL: ${config.baseUrl}`);
}

logResponse(response);
logConfig({ baseUrl: 'https://api.example.com', timeout: 5000, headers: DEFAULT_HEADERS });
console.log(anotherResponse);

// Type-only export — re-exports only the type, erased from JS output:
export type { ApiResponse };

// ---------------------------------------------------------------------------
// Why it matters
// ---------------------------------------------------------------------------

// 1. Avoids side effects — importing a module can trigger top-level code
//    (logging, SDK init, global registration, DB connections).
//    A regular `import { SomeType } from './heavy'` still emits require()
//    or an ESM import in JS, executing that module's top-level code.
//    `import type` guarantees the import is fully erased — no runtime load,
//    no side effects, no added bundle size.
//
// 2. Prevents circular dependency issues — if module A needs a type from B
//    and B imports from A at runtime, a type-only import avoids the cycle.
//
// 3. Explicit intent — `import type` tells readers immediately: this is only
//    for type annotations, never used at runtime.

// ---------------------------------------------------------------------------
// `verbatimModuleSyntax` (TypeScript 5.0+)
// ---------------------------------------------------------------------------

// This tsconfig flag enforces that every type-only import must use `import type`
// (or inline `type`). Replaces the older `importsNotUsedAsValues` flag.
//
// Especially important with single-file transpilers (SWC, esbuild, Babel) —
// they can't do cross-file analysis to know if an import is type-only.

// ❌ Would error with `verbatimModuleSyntax` — bare import used only as a type:
import { RequestConfig as BareConfig } from './types';
const _cfg: BareConfig = { baseUrl: '', timeout: 0, headers: {} };

// ✅ Explicit type-only import:
import type { RequestConfig as TypeOnlyConfig } from './types';
const _cfg2: TypeOnlyConfig = { baseUrl: '', timeout: 0, headers: {} };

// ✅ Inline `type` — mix values and types in one statement:
import { DEFAULT_HEADERS as DH, type RequestConfig as InlineConfig } from './types';
const _cfg3: InlineConfig = { baseUrl: '', timeout: 0, headers: DH };

// Type-only re-exports in barrel files (index.ts) keep the emitted JS clean.
// Without `export type`, the compiled JS still contains the import statement
// (e.g. `require('./user.types')`) — the module is loaded and any top-level
// side effects run, even though no exported values are actually used.
// That top-level code could be logging, polyfills, DB connections, SDK init, etc.
//
//   export { UserModel } from './user.model';              // runtime value — kept in JS
//   export type { UserDto, UserRole } from './user.types'; // erased — user.types is never loaded
//   export type * from './user.types';                     // wildcard version — re-exports all types, fully erased
