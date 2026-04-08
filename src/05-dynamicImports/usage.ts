// =============================================================================
// Dynamic Imports (import())
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#dynamic-import

// Static imports are resolved at compile time and bundled eagerly. Dynamic
// `import()` returns a Promise resolved at runtime — letting you load modules
// on demand for code splitting, conditional loading, and lazy routes.

// Dynamic import returns a Promise with the full module namespace.
// Destructure to grab specific exports:
async function showChart() {
  const { renderChart } = await import('./heavy');
  console.log(renderChart([10, 20, 30, 40]));
}

// TypeScript infers the full module type, so you get autocompletion
// and type-checking on the resolved value:
async function showReport() {
  const mod = await import('./heavy');
  //    ^? const mod: typeof import('./heavy')
  console.log(mod.generateReport('Monthly Sales'));
}

// ---------------------------------------------------------------------------
// Conditional loading based on runtime context
// ---------------------------------------------------------------------------

type Environment = 'development' | 'production';

async function loadLogger(env: Environment) {
  if (env === 'development') {
    // In dev, load a verbose logger:
    const { default: Logger } = await import('../02-defaultExport/logger');
    return new Logger('DEV');
  }

  // In production, use a lightweight alternative:
  return {
    info: (msg: string) => console.log(msg),
    error: (msg: string) => console.error(msg),
  };
}

// ---------------------------------------------------------------------------
// Feature-flag-driven code splitting
// ---------------------------------------------------------------------------

interface FeatureFlags {
  enableAnalytics: boolean;
  enableExport: boolean;
}

// Bundler sees each `import()` as a split point and creates a separate chunk.
// The module is only fetched if the condition is true:
async function initDashboard(flags: FeatureFlags) {
  console.log('Loading base dashboard...');

  if (flags.enableAnalytics) {
    const { renderChart } = await import('./heavy');
    console.log(renderChart([100, 200, 150]));
  }

  if (flags.enableExport) {
    const { generateReport } = await import('./heavy');
    console.log(generateReport('Q4 Results'));
  }
}

// You can also reference types from a module without importing it at runtime,
// using `import('...')` as a type:
type HeavyModule = typeof import('./heavy');
type ChartFn = HeavyModule['renderChart'];

// ---------------------------------------------------------------------------
// Gotchas
// ---------------------------------------------------------------------------

// Always use string literals in `import()` — if you use a variable,
// bundlers can't determine chunk boundaries and TS can't infer the type:
const path = './heavy';
const dynamicResult = import(path);       // hover: Promise<any>
const literalResult = import('./heavy');   // hover: Promise<typeof import("./heavy")>

// Dynamic imports can fail at runtime (network error, missing chunk).
// Always handle the rejection:
//   import('./heavy').then(mod => mod.renderChart([1,2])).catch(console.error);

// SSR — dynamic imports behave differently on server vs client.
// Frameworks like Next.js provide `next/dynamic` to handle this.

showChart();
showReport();
loadLogger('development').then((logger) => logger.info('App started'));
initDashboard({ enableAnalytics: true, enableExport: false });
