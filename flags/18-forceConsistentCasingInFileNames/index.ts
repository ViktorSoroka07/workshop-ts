// =============================================================================
// forceConsistentCasingInFileNames
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#forceConsistentCasingInFileNames

// Errors when one file is imported under two spellings that differ only in letter case.
//
// macOS and Windows filesystems ignore case, so './account' finds `Account.ts` there.
// Linux (most CI servers and containers) does not: './account' is a different path and
// is not found. A project written on a Mac builds locally and fails on the build server.
// With this flag, TypeScript rejects the inconsistent spelling on the Mac too.
//
// It is ON BY DEFAULT: an empty tsconfig reports the error below on 6.0.2 and 7.0.2
// (the shared base config writes it out as well). Setting it to `false` is what
// turns it off.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

// The file on disk is `Account.ts`:
import { MIN_BALANCE } from './Account';

// Same file, spelled './account'. The Mac finds it, and TypeScript reports the clash.
// This line uses `@ts-ignore` and not `@ts-expect-error`: the clash is found while the
// program collects its files, and a `@ts-expect-error` here hides the error and is then
// reported itself as unused (TS2578).

// @ts-ignore
import { type Account } from './account'; // Error: File name '…/account.ts' differs from already included file name '…/Account.ts' only in casing.

// The message lists both import sites. On a Mac this is one file; on a Linux server it is
// two spellings, one of which does not exist.

const savings: Account = { owner: 'Alice' };
console.log(savings, MIN_BALANCE); // { owner: 'Alice' } 0

// ---------------------------------------------------------------------------
// Fix
// ---------------------------------------------------------------------------

// Spell the path as the file name is written, everywhere:
//
//   import { type Account, MIN_BALANCE } from './Account';

// 🧪 Try it: delete the `@ts-ignore` line above and the error is there. Then set
// `"forceConsistentCasingInFileNames": false` in this folder's tsconfig.json: on a Mac or
// Windows machine the error is gone, because the filesystem finds the file both ways.
// The same code on a Linux server fails with "Cannot find module './account'" (TS2307),
// which cannot be reproduced on a case-insensitive disk.

export {};
