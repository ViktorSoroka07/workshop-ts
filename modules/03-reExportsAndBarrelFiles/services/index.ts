// =============================================================================
// Barrel File — re-exports everything from this folder
// =============================================================================

// Wildcard re-export — forwards all named exports from each module.
// Does NOT forward default exports. notification.ts has a default export
// (`sendUrgent`), but `export *` below skips it — only the named exports
// (NotificationService, NotificationChannel) come through:
export * from './auth';
export * from './user';
export * from './notification';

// To also re-export the default, you must do it explicitly:
export { default as sendUrgent } from './notification';

// If two sub-modules export the same name (e.g., both export `Config`),
// `export *` from both makes that name ambiguous. TypeScript catches this —
// the conflicting name won't show up in the barrel, and any consumer trying
// to import `Config` gets a compile error.
//
// In plain JavaScript there's no such safety: the last `export *` silently
// shadows the earlier one, so the consumer gets one `Config` with no warning
// that another was lost.
//
// Fix by re-exporting explicitly with rename:
//
//   export { Config as AuthConfig } from './auth';
//   export { Config as UserConfig } from './user';
