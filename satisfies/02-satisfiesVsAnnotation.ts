// =============================================================================
// `satisfies` vs a Type Annotation
// =============================================================================

// Both check the value against a type, and both catch the extra property below.
// They differ in what the variable's type is afterwards:
//   annotation  `const x: T = value`   x has type T          (the value's own type is gone)
//   satisfies   `const x = value satisfies T`   x has the value's inferred type

import type { AppConfig } from './AppConfig';

const annotatedConfig: AppConfig = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  // @ts-expect-error
  debugMode: true, // Error: Object literal may only specify known properties, and 'debugMode' does not exist in type 'AppConfig'.
};

const checkedConfig = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  // @ts-expect-error
  debugMode: true, // Error: Object literal may only specify known properties, and 'debugMode' does not exist in type 'AppConfig'.
} satisfies AppConfig;

// --- A wide target: the annotation forgets which keys exist ---
type RouteTable = Record<string, { title: string }>;

const annotatedRoutes: RouteTable = {
  '/users': { title: 'Users' },
  '/admin/users': { title: 'Admin users' },
};

annotatedRoutes['/usres']; // OK -- type: { title: string }; the typo is not caught (and it is undefined at runtime)

const routes = {
  '/users': { title: 'Users' },
  '/admin/users': { title: 'Admin users' },
} satisfies RouteTable;

routes['/users']; // OK -- type: { title: string }

// @ts-expect-error
routes['/usres']; // Error: Property '/usres' does not exist on type '{ '/users': { title: string; }; '/admin/users': { title: string; }; }'. Did you mean '/users'?

// --- A union target: the annotation forgets which member each value is ---
type Server = { port: number | string };

const annotatedServer: Server = { port: 8080 };
// @ts-expect-error
annotatedServer.port.toFixed(); // Error: Property 'toFixed' does not exist on type 'string | number'.

const server = { port: 8080 } satisfies Server;

server.port.toFixed(); // OK -- type: number

// ✅ Best practice: reach for `satisfies` on constants and lookup tables, where you
// want both the check and the exact keys and values.

// --- Where the annotation is still right ---

// 1. Function parameters and return types: `satisfies` cannot appear there.
function loadConfig(): AppConfig {
  return { apiUrl: { host: '/api', port: 8080 }, retryCount: 3 };
}

// 2. A container you fill later: the wide type is the point.
const cache: Record<string, unknown> = {};
cache.userId = 123; // OK
cache.theme = 'dark'; // OK

const checkedCache = {} satisfies Record<string, unknown>;
// @ts-expect-error
checkedCache.userId = 123; // Error: Property 'userId' does not exist on type '{}'.

// 3. A variable that will hold other values later: the value's narrow type would not
//    allow them.
let activeServer: Server = { port: 8080 };
activeServer = { port: 'localhost' }; // OK

let checkedServer = { port: 8080 } satisfies Server;
// @ts-expect-error
checkedServer = { port: 'localhost' }; // Error: Type 'string' is not assignable to type 'number'.
