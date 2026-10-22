// A barrel mixing values and types. `type` on a re-export says "types only":
export { DEFAULT_HEADERS } from './types';
export type { ApiResponse } from './types'; // one named type
export type * from './analytics'; // every export of the module, all as types (TypeScript 5.0+)
