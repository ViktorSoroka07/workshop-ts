// =============================================================================
// Type-Only Imports and Exports
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export

// Interfaces and type aliases exist only for the compiler: they never reach the
// emitted JavaScript. `import type` says so in the code itself.

// A whole statement of types, erased from the JS:
import type { ApiResponse, RequestConfig } from './types';

// Inline `type` (TypeScript 4.5+): values and types in one statement.
// `DEFAULT_HEADERS` stays in the JS, `ApiResponse` is erased:
import {
  DEFAULT_HEADERS,
  type ApiResponse as InlineApiResponse,
} from './types';

// Types in annotations work as usual:
const response: ApiResponse<string> = {
  data: 'test',
  status: 200,
  message: 'OK',
};

const inlineResponse: InlineApiResponse<number> = {
  data: 42,
  status: 200,
  message: 'OK',
};

const config: RequestConfig = {
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  headers: DEFAULT_HEADERS,
};

console.log(DEFAULT_HEADERS); // { 'Content-Type': 'application/json' }
console.log(response, inlineResponse, config);

// ⚠️ Gotcha: a name imported with `import type` is not a value, even if the export is one:
import type { DEFAULT_HEADERS as ErasedHeaders } from './types';

try {
  // @ts-expect-error
  console.log(ErasedHeaders); // Error: 'ErasedHeaders' cannot be used as a value because it was imported using 'import type'.
} catch (error) {
  console.log((error as Error).message); // ErasedHeaders is not defined -- the import was erased, so the name never existed at runtime
}

// A type query is allowed, because it never runs:
type HeaderMap = typeof ErasedHeaders; // type: { [x: string]: string; } -- the hover expands Record<string, string>

const contentHeaders: HeaderMap = { 'Content-Type': 'text/plain' };
console.log(contentHeaders); // { 'Content-Type': 'text/plain' }

// ---------------------------------------------------------------------------
// Why `type` is not optional
// ---------------------------------------------------------------------------

// A module can do work the moment it is loaded (see ./analytics.ts). `AnalyticsEvent` is
// imported here without `type` and used only in an annotation:
import { AnalyticsEvent } from './analytics';

const signup: AnalyticsEvent = { name: 'signup', at: Date.now() };
console.log(signup.name); // signup -- and "analytics SDK started" never prints

// `tsc` looks inside ./analytics, sees that `AnalyticsEvent` is only a type, and drops the
// import. A tool that reads one file at a time cannot see that, and keeps the import:
//   - Node runs TypeScript by stripping the annotations from each file. With the plain
//     import it stops at startup, because ./analytics has no export of that name (Node
//     needs the extension written, `'./analytics.ts'`):
//       SyntaxError: The requested module './analytics.ts' does not provide an export named 'AnalyticsEvent'
//     With `import type` the whole line is stripped and the file runs.
//   - `verbatimModuleSyntax` makes `tsc` refuse the guess: the plain import is error TS1484,
//     "'AnalyticsEvent' is a type and must be imported using a type-only import".
// `import type` also tells the reader.

// To load a module only for its side effect, write the bare form -- it is always kept:
//   import './analytics';

// 🧪 Try it: uncomment `"verbatimModuleSyntax": true` in ../tsconfig.json. The import of
// `AnalyticsEvent` above fails with TS1484 (so do the plain type imports in lessons 01 to 03,
// which come before `type` is taught). Add `type` to the import and the error goes away.

// ✅ Best practice: write `import type` for names used only as types. The flag
// `verbatimModuleSyntax` makes the compiler enforce it -- see ../../flags/15-verbatimModuleSyntax/index.ts.
// It is switched on by the commented line in ../tsconfig.json.

// ---------------------------------------------------------------------------
// Why it matters
// ---------------------------------------------------------------------------

// 1. Breaks import cycles: if A needs only a type from B while B imports a value
//    from A, `import type` removes the runtime edge between them.
// 2. Intent: a reader sees at once that the import is for annotations only.
// 3. Barrels: `export type { … }` and `export type * from` keep type-only modules
//    out of the emitted JS of a barrel. ./index.ts is such a barrel, imported nowhere:
//    compile the folder as in ../README.md and read dist/modules/04-typeOnlyImports/index.js.
