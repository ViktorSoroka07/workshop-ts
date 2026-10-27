// =============================================================================
// `as const satisfies`: Exact Values, Checked Shape
// =============================================================================

// `as const` (../types/13-assertionsAndAsConst.ts) freezes every value to its literal
// type but checks nothing about the shape. `satisfies` checks the shape. Together they
// suit constants such as route maps, where both matter.

import type { AppConfig } from './AppConfig';

type Endpoint = { path: string; method: 'GET' | 'POST' | 'DELETE' };

// `satisfies` alone: the `string` fields stay `string`
const looseEndpoints = {
  listUsers: { path: '/users', method: 'GET' },
  createUser: { path: '/users', method: 'POST' },
} satisfies Record<string, Endpoint>;

looseEndpoints.createUser.path; // type: string
looseEndpoints.createUser.method; // type: "POST" -- a literal target type keeps literals

// With `as const`: every value is exact, and the properties are readonly
const endpoints = {
  listUsers: { path: '/users', method: 'GET' },
  createUser: { path: '/users', method: 'POST' },
} as const satisfies Record<string, Endpoint>;

endpoints.createUser.path; // type: "/users"
endpoints.createUser.method; // type: "POST"

// @ts-expect-error
endpoints.createUser.path = '/accounts'; // Error: Cannot assign to 'path' because it is a read-only property.

// ⚠️ Gotcha: `readonly` exists only at compile time, so the rejected assignment still ran:
console.log(endpoints.createUser.path); // /accounts

const brokenEndpoints = {
  listUsers: { path: '/users', method: 'GET' },
  // @ts-expect-error
  createUser: { path: '/users', method: 'PSOT' }, // Error: Type '"PSOT"' is not assignable to type '"GET" | "POST" | "DELETE"'.
} as const satisfies Record<string, Endpoint>;

// The exact keys are known, so they can drive other types (../types/14-typeofKeyofIndexedAccess.ts):
type EndpointName = keyof typeof endpoints; // type: "listUsers" | "createUser"

function describeEndpoint(name: EndpointName) {
  const { method, path } = endpoints[name];

  return `${method} ${path}`;
}

// @ts-expect-error
describeEndpoint('deleteUser'); // Error: Argument of type '"deleteUser"' is not assignable to parameter of type '"listUsers" | "createUser"'.

// An object you update at runtime does not want `as const`: it only adds `readonly` and
// the literal types, and the update needs neither.
const appConfig = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
} as const satisfies AppConfig;

appConfig.retryCount; // type: 3

// @ts-expect-error
appConfig.retryCount = 4; // Error: Cannot assign to 'retryCount' because it is a read-only property.
