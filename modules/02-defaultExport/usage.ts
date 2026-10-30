// The importer chooses the name -- it has no connection to the one in the source:
import Logger from './logger';
import AppLogger from './logger'; // same class, different name
import Banana from './logger'; // compiles too

// Default and named exports in one statement -- default first, braces for the rest:
import Log, { LOG_LEVELS, LogLevel } from './logger';

const logger = new Logger('API');
logger.info('Request received');

// ⚠️ Gotcha: all four names are the same class, and the compiler is fine with that.
// A code search for "AppLogger" never finds the definition, which says `Logger`:
const appLogger = new AppLogger('APP');
appLogger.error('Something went wrong');

const banana = new Banana('PAYMENTS');
banana.info('This compiles fine');

const level: LogLevel = 'info';
console.log(LOG_LEVELS, level); // [ 'debug', 'info', 'warn', 'error' ] info

// Braces ask for a named export, and `Logger` is the default one, so this fails. The
// module has no export called `Logger`; the class is just the default, whatever its name:
// @ts-expect-error
import { Logger as NamedLogger } from './logger'; // Error: Module '"./logger"' has no exported member 'Logger'. Did you mean to use 'import Logger from "./logger"' instead?

// ---------------------------------------------------------------------------
// Why most teams prefer named exports
// ---------------------------------------------------------------------------

// 1. Rename safety: renaming a named export breaks every import site, so you find them.
//    Renaming a default export changes nothing for consumers -- they keep their own name.
// 2. One name per thing: with defaults the same class is `Logger` in one file and
//    `AppLogger` in another, and search stops working.
// 3. Auto-import: editors suggest a named export under its real name.

// ✅ Best practice: named exports by default.

// Default exports earn their place where a tool looks for "the" export of a file:
//   - frameworks that load a file by convention: `export default function Page() { … }`
//   - config files: `export default defineConfig({ … })`
// There the importer is not you, so nobody picks a name.

// ⚠️ Gotcha: `export *` skips default exports. Forwarding one takes an explicit
// `export { default as Logger } from './logger'` -- shown in the barrel lesson.

const log = new Log('MAIN');
log.info('App started');
