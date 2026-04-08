// =============================================================================
// Re-exports and Barrel Files
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#re-exports

// Re-exports forward exports from other modules without consuming them locally.
// The barrel file at ./services/index.ts aggregates everything into one path.

// ✅ Clean — single import path via barrel file:
import {
  AuthService,
  UserService,
  NotificationService,
  sendUrgent,
  type AuthToken,
  type UserProfile,
  type NotificationChannel,
} from './services';

// ❌ Without barrel — consumer must know internal file structure:
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

// sendUrgent is the default export from notification.ts — it only works here
// because the barrel explicitly re-exports it as a named export:
//   export { default as sendUrgent } from './notification';
sendUrgent('Server is on fire');

// ---------------------------------------------------------------------------
// Gotchas
// ---------------------------------------------------------------------------

// Circular dependencies — modern bundlers (webpack, Vite) can often resolve
// circular imports, but it's not guaranteed: you may hit issues with undefined
// values at runtime depending on evaluation order. To stay safe, sibling
// modules should import directly from each other, NOT from their own barrel.
// The `import/no-cycle` rule (eslint-plugin-import / eslint-plugin-import-x)
// catches these at lint time:
//
//   // ❌ auth.ts importing from its own barrel
//   import { UserService } from './index';
//
//   // ✅ direct sibling import
//   import { UserService } from './user';

// Bundle size — deep barrel chains (barrel → barrel → barrel) can defeat
// tree-shaking in some setups and slow down dev server startup.
// One level of barrels per feature folder is the sweet spot.

// This project also uses barrels in practice:
//   src/07-moduleResolution/User/index.ts  → export * from './User'
//   src/07-moduleResolution/index.ts       → export * from './User'
//   src/utils/index.ts            → export * from './getUserName'
