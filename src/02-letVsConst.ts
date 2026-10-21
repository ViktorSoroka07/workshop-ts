// =============================================================================
// 2. `let` vs `const` Type Inference
// =============================================================================

// `const` infers the *literal* type (the exact value), `let` infers the *widened* type:
const API_VERSION = 2; // type: 2 (literal)
let currentVersion = 2; // type: number (widened)

const DEFAULT_METHOD = 'GET'; // type: "GET" (literal)
let method = 'GET'; // type: string (widened)
