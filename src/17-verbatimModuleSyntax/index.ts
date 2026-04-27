// =============================================================================
// verbatimModuleSyntax
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax

// Forces imports/exports to declare which bindings are type-only. TS keeps
// value imports in the emitted JS verbatim and erases anything marked `type`.
//
// Replaces the older pair of flags `importsNotUsedAsValues` and
// `preserveValueImports`. Recommended for any modern project — it makes the
// emit predictable and prevents accidental side-effect imports of "type-only"
// modules.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// Mixing types and values in a default import — TS can't tell which is which:

// @ts-expect-error
import { User, VERSION } from './types';
// ❌ 'User' is a type and must be imported using a type-only import when
//    'verbatimModuleSyntax' is enabled.

// ---------------------------------------------------------------------------
// Fix 1: separate type-only and value imports
// ---------------------------------------------------------------------------

import type { User as User1 } from './types';
import { VERSION as VERSION1 } from './types';

const a: User1 = { name: 'Alice' };
console.log(a, VERSION1);

// ---------------------------------------------------------------------------
// Fix 2: inline `type` modifier — keep both on one statement
// ---------------------------------------------------------------------------

import { type User as User2, VERSION as VERSION2 } from './types';

const b: User2 = { name: 'Bob' };
console.log(b, VERSION2);
