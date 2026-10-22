// =============================================================================
// Default Exports vs Named Exports
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/modules.html#default-exports

// A module can have at most ONE default export. The importer picks the name,
// and writes no braces.

// Default-exporting a class (parameter properties: see ../classes/04-parameterProperties.ts):
export default class Logger {
  constructor(private prefix: string) {}

  info(message: string): void {
    console.log(`[${this.prefix}] INFO: ${message}`);
  }

  error(message: string): void {
    console.error(`[${this.prefix}] ERROR: ${message}`);
  }
}

// A module can have a default AND named exports:
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];
