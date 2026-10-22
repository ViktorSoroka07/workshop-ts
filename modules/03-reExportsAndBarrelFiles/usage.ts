// =============================================================================
// Re-exports and Barrel Files
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#re-exports

// A re-export forwards names from another module without using them in the file.
// A barrel is an `index.ts` made of re-exports, so a folder has one public path.

// One import path, whatever files the names live in (`type` marks type-only names -- next lesson):
import {
  AuthService,
  UserService,
  NotificationService,
  sendUrgent,
  type AuthToken,
  type UserProfile,
  type NotificationChannel,
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

// Importing one name from a barrel makes the bundler load the barrel and look
// through every module it forwards. Deep chains (barrel -> barrel -> barrel) can
// defeat tree-shaking and slow the dev server.
// ✅ Best practice: one barrel per feature folder, not a barrel of barrels.

// ---------------------------------------------------------------------------
// 🎓 On your own: circular imports through a barrel
// ---------------------------------------------------------------------------

// Harder because the bug only shows at runtime, and only from the order in which
// files load. Read ./cycle/ -- the compiler accepts it, node prints the proof.
// The rule it teaches: files inside a folder import their siblings directly, never
// through the folder's own barrel.
