// =============================================================================
// forceConsistentCasingInFileNames
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#forceConsistentCasingInFileNames

// Ensures import paths match the actual file name casing on disk.
//
// macOS and Windows filesystems are case-insensitive by default, so
// `import { User } from './user'` works locally even when the file is `User.ts`.
// On Linux (and most CI servers), filesystems are case-sensitive — the
// build breaks the moment it hits CI.
//
// With this flag, TS catches the mismatch locally before it lands in CI.

// ---------------------------------------------------------------------------
// What it catches (kept as comments — a live demo on macOS can't reproduce
// the case-sensitive failure, since the host filesystem is case-insensitive)
// ---------------------------------------------------------------------------

//   // File on disk: src/User.ts
//   import { User } from './user';  // ❌ File name differs only in casing
//   import { User } from './User';  // ✅
//
//   // File on disk: src/utils/index.ts
//   import { helper } from './Utils';  // ❌ folder is './utils'
//   import { helper } from './utils';  // ✅

// ---------------------------------------------------------------------------
// Note on TS 5.0+
// ---------------------------------------------------------------------------

// As of TypeScript 5.0, this flag defaults to `true`. It's still listed here
// because older codebases may have it explicitly disabled — keep it on.

export {};
