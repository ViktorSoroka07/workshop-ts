// =============================================================================
// Default Exports vs Named Exports
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#default-exports

// Each module can have at most ONE default export. The consumer chooses any
// name they like when importing it — no curly braces needed.

// Default-exporting a class:
export default class Logger {
  constructor(private prefix: string) {}

  info(message: string): void {
    console.log(`[${this.prefix}] INFO: ${message}`);
  }

  error(message: string): void {
    console.error(`[${this.prefix}] ERROR: ${message}`);
  }
}

// A module can have BOTH a default and named exports:
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];
