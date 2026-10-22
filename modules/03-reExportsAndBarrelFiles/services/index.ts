// =============================================================================
// Barrel File -- the one door into this folder
// =============================================================================

// `export * from` forwards every NAMED export of a module:
export * from './auth';
export * from './user';
export * from './notification';

// ⚠️ Gotcha: it does not forward the default export. `sendUrgent` in notification.ts
// is a default export, so it needs a line of its own, naming the new export:
export { default as sendUrgent } from './notification';
