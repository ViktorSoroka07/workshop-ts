// =============================================================================
// Re-exports and Barrel Files
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#re-exports

// A re-export forwards names from another module without using them in the file.
// A barrel is an `index.ts` made of re-exports, so a folder has one public path.

// One import path, whatever files the names live in:
import {
  AuthService,
  UserService,
  NotificationService,
  sendUrgent,
  AuthToken,
  UserProfile,
  NotificationChannel,
} from './services';

// Without the barrel, every consumer learns the folder's file layout, and a
// file move breaks all of them:
//   import { AuthService } from './services/auth';
//   import { UserService } from './services/user';
//   import { NotificationService } from './services/notification';

const auth = new AuthService();
const users = new UserService();
const notifications = new NotificationService();

const token: AuthToken = auth.login('jane', 's3cret');
console.log('Authenticated:', auth.isAuthenticated(), token);

users.getProfile('user-1').then((profile: UserProfile) => {
  console.log(`Welcome, ${profile.name} (${profile.role})`);
});

const channel: NotificationChannel = 'email';
notifications.send(channel, 'Your order has shipped');

// Default exports reach the consumer only because the barrel renamed one:
sendUrgent('Server is on fire');

// ---------------------------------------------------------------------------
// ⚠️ Gotcha: two modules, one name
// ---------------------------------------------------------------------------

// If two modules behind `export *` both export `Config`, the barrel cannot choose.
// TypeScript flags it at the second `export *` -- see ./conflict/index.ts.
// Re-exporting by name, with a rename, resolves it.

// ---------------------------------------------------------------------------
// ⚠️ Gotcha: barrels cost bundle size
// ---------------------------------------------------------------------------

// Importing one name from a barrel makes a dev server or test runner load every module
// it forwards, and a production bundler can only skip the unused ones when it can prove
// they have no side effects. Each extra layer (barrel -> barrel -> barrel) adds to both.
// ✅ Best practice: one barrel per feature folder, not a barrel of barrels.
//
// One barrel per feature -- each is the door into its own folder, and nothing else:
//   auth/index.ts      import { AuthService } from './auth'    -> loads auth/ only
//   billing/index.ts   import { Invoice } from './billing'     -> loads billing/ only
//
// A barrel of barrels -- a root file that forwards the feature barrels:
//   index.ts           export * from './auth'; export * from './billing';
//   import { AuthService } from '.'
//     -> index.ts -> auth/index.ts -> auth/authService.ts   (the name you asked for)
//     -> index.ts -> billing/index.ts -> every billing file  (loaded too, never used)

// ---------------------------------------------------------------------------
// 🎓 On your own: circular imports through a barrel
// ---------------------------------------------------------------------------

// Harder because the bug only shows at runtime, and only from the order in which
// files load. Read ./cycle/ -- the compiler accepts it, node prints the proof.
// The rule it teaches: files inside a folder import their siblings directly, never
// through the folder's own barrel.
