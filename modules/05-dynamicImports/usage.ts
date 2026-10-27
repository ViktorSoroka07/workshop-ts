// =============================================================================
// Dynamic Imports (import())
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#dynamic-import

// A static `import` is resolved before any code runs, so the module is always loaded.
// `import()` is an expression: it returns a Promise and loads the module when that
// line runs. Bundlers cut the module into its own file (a chunk) and fetch it on demand.

// Destructure the resolved module to take specific exports:
async function showChart() {
  const { renderChart } = await import('./heavy');
  console.log(renderChart([10, 20, 30, 40])); // [Chart: 10, 20, 30, 40]
}

// TypeScript types the resolved value as the whole module:
async function showReport() {
  const heavy = await import('./heavy'); // type: typeof import("./heavy")
  console.log(heavy.generateReport('Monthly Sales'));
}

// The module is loaded once. A second `import('./heavy')` gets the same module back,
// and 'heavy.ts loaded' prints a single time.

// ---------------------------------------------------------------------------
// Loading on a condition
// ---------------------------------------------------------------------------

type Environment = 'development' | 'production';

// A default export arrives as the property `default` of the module object:
async function createLogger(env: Environment) {
  if (env === 'development') {
    const { default: Logger } = await import('../02-defaultExport/logger');

    return new Logger('DEV');
  }

  return {
    info: (message: string) => console.log(message),
    error: (message: string) => console.error(message),
  };
}

// The bundle for production never fetches the verbose logger. Same idea for features:
interface FeatureFlags {
  enableAnalytics: boolean;
  enableExport: boolean;
}

async function initDashboard(flags: FeatureFlags) {
  console.log('Loading base dashboard...');

  if (flags.enableAnalytics) {
    const { renderChart } = await import('./heavy');
    console.log(renderChart([100, 200, 150])); // [Chart: 100, 200, 150]
  }

  if (flags.enableExport) {
    const { generateReport } = await import('./heavy');
    console.log(generateReport('Q4 Results'));
  }
}

// ---------------------------------------------------------------------------
// Using a module's type without loading it
// ---------------------------------------------------------------------------

// `typeof import('./heavy')` in a type position loads nothing at runtime:
type HeavyModule = typeof import('./heavy');
type ChartRenderer = HeavyModule['renderChart']; // type: (data: number[]) => string

const renderWith: ChartRenderer = (data) => data.join('|');
console.log(renderWith([1, 2])); // 1|2

// ---------------------------------------------------------------------------
// ⚠️ Gotcha: a string literal keeps the types
// ---------------------------------------------------------------------------

// With a literal, TypeScript knows which module you mean:
const literalResult = import('./heavy'); // type: Promise<typeof import("./heavy")>

// With a string held in a variable it cannot know, and the bundler cannot split a
// chunk it cannot see:
const chosenPath: string = './heavy';
const computedResult = import(chosenPath); // type: Promise<any>

// ⚠️ Gotcha: loading can fail at runtime (network error, missing chunk), so a bare
// `await import(…)` needs a `try/catch`, or a `.catch` on the promise:
//   import('./heavy').then((heavy) => heavy.renderChart([1, 2])).catch(console.error);

showChart();
showReport();
createLogger('development').then((logger) => logger.info('App started'));
initDashboard({ enableAnalytics: true, enableExport: false });

// ⚠️ Gotcha: `import()` alone does not make a file a module -- this file has no static
// import or export, so it is a script and its names (`showChart`, `Environment`)
// would be global. `export {}` makes it a module:
export {};
