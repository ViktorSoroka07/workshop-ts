// Consumer can import a default export with ANY name — no connection to the original:
import Logger from './logger';
import AppLogger from './logger'; // also works — same thing, different name
import Banana from './logger'; // confusing, but valid

// Importing default + named exports together:
import Log, { LOG_LEVELS, LogLevel } from './logger';

const logger = new Logger('API');
logger.info('Request received');

// All three are the exact same class — this is the problem with defaults.
// Code search for "AppLogger" won't find the definition, because it's
// defined as "Logger" in the source:
const appLogger = new AppLogger('APP');
appLogger.error('Something went wrong');

const banana = new Banana('WAT');
banana.info('This compiles fine');

const level: LogLevel = 'info';
console.log(LOG_LEVELS, level);

// `export * from './module'` only re-exports named exports.
// Default exports require manual re-export:
//   export { default as Logger } from './logger';

// ---------------------------------------------------------------------------
// Why the community prefers named exports over defaults
// ---------------------------------------------------------------------------
//
// 1. Refactoring safety — renaming a named export triggers errors at every
//    import site. Renaming a default export changes nothing for consumers.
//
// 2. Consistent naming — with defaults, one file imports `Logger`, another
//    `AppLogger`, a third `Log` — all the same thing, code search breaks.
//
// 3. Tree-shaking — named exports are individually shakeable.
//    `export default { a, b, c }` can't be partially shaken.
//
// 4. Auto-import — IDEs resolve named exports more reliably.

// ---------------------------------------------------------------------------
// When default exports ARE appropriate
// ---------------------------------------------------------------------------
//
// - Framework conventions that require them (Next.js pages/routes):
//     export default function Page() { ... }
//
// - Config files (Vite, ESLint flat config):
//     export default defineConfig({ ... })

const log = new Log('MAIN');
log.info('App started');
