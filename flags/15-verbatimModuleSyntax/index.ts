// =============================================================================
// verbatimModuleSyntax
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax

// The compiler keeps every import and export you write in the emitted JavaScript,
// except the ones marked `type`, which it erases. So it can no longer guess for you:
// an import that brings in only a type must say `type`, or the build fails.
//
// What `import type` is, and why to write it, is ../../modules/04-typeOnlyImports/usage.ts.
// This lesson is what the FLAG enforces. It is NOT on by default and NOT part of
// `strict`. It replaces `importsNotUsedAsValues` and `preserveValueImports`, which
// TypeScript 6 reports as removed (TS5102: "Use 'verbatimModuleSyntax' instead").

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// `User` is an interface and `VERSION` a value. Without a marker, the import of `User`
// is one the emitted JavaScript must not contain:

// @ts-expect-error
import { User, VERSION } from './types'; // Error: 'User' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.

// ---------------------------------------------------------------------------
// Two fixes
// ---------------------------------------------------------------------------

// Fix 1: a separate type-only statement:
import type { User as User1 } from './types';
import { VERSION as VERSION1 } from './types';

const alice: User1 = { name: 'Alice' };
console.log(alice, VERSION1); // { name: 'Alice' } 1

// Fix 2: the inline `type` modifier, both on one statement:
import { type User as User2, VERSION as VERSION2 } from './types';

const bob: User2 = { name: 'Bob' };
console.log(bob, VERSION2); // { name: 'Bob' } 1

// ---------------------------------------------------------------------------
// The other errors it adds
// ---------------------------------------------------------------------------

// A name imported with `type` cannot be used as a value:
import type { VERSION as VersionType } from './types';

// @ts-expect-error
console.log(VersionType); // Error: 'VersionType' cannot be used as a value because it was imported using 'import type'.

// A re-export of a type needs `type` as well:

// @ts-expect-error
export { User } from './types'; // Error: Re-exporting a type when 'verbatimModuleSyntax' is enabled requires using 'export type'.

export type { User as ExportedUser } from './types'; // OK

// ---------------------------------------------------------------------------
// What the emitted JavaScript contains
// ---------------------------------------------------------------------------

//   import type { User } from './types';          erased: nothing in the JS
//   import { type User, VERSION } from './types'; import { VERSION } from './types';
//   import { type User } from './types';          import {} from './types';
//
// ⚠️ Gotcha: the last form is not erased. The JS keeps `import {} from './types'`, so the
// module is still loaded and its top-level code still runs. Write `import type { User }`
// when nothing from the module is needed at runtime.

// 🎓 On your own: the flag also ties a file's syntax to its module format, which makes it
// harder: the answer lives in tsconfig.json and package.json together. In a copy of this
// lesson set `"module": "commonjs"` and the `import` and `export` lines of a .ts file are
// reported (TS1295: "ECMAScript imports and exports cannot be written in a CommonJS
// file under 'verbatimModuleSyntax'"). The fix is a module setting that matches the
// files, or `"type": "module"` in the nearest package.json -- how the format is chosen
// is ../../modules/07-moduleResolution/usage.ts.

// ✅ Best practice: switch it on in new projects. The emitted code is the code you wrote
// minus the types, and a single-file transpiler (esbuild, SWC, Babel) can read it
// without looking at other files.
