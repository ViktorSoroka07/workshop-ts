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
looseEndpoints.createUser.method; // type: 'POST' -- a literal target type keeps literals

// With `as const`: every value is exact, and the properties are readonly
const endpoints = {
  listUsers: { path: '/users', method: 'GET' },
  createUser: { path: '/users', method: 'POST' },
} as const satisfies Record<string, Endpoint>;

endpoints.createUser.path; // type: '/users'
endpoints.createUser.method; // type: 'POST'

// @ts-expect-error
endpoints.createUser.path = '/accounts'; // Error: Cannot assign to 'path' because it is a read-only property.

const brokenEndpoints = {
  listUsers: { path: '/users', method: 'GET' },
  // @ts-expect-error
  createUser: { path: '/users', method: 'PSOT' }, // Error: Type '"PSOT"' is not assignable to type '"GET" | "POST" | "DELETE"'.
} as const satisfies Record<string, Endpoint>;

// The exact keys are known, so they can drive other types (../types/14-typeofKeyofIndexedAccess.ts):
type EndpointName = keyof typeof endpoints; // 'listUsers' | 'createUser'

function describeEndpoint(name: EndpointName) {
  const { method, path } = endpoints[name];

  return `${method} ${path}`;
}

// ⚠️ Gotcha: `readonly` exists only at compile time, so the rejected assignment above would
// still have run:
console.log(describeEndpoint('createUser')); // POST /accounts

// @ts-expect-error
describeEndpoint('deleteUser'); // Error: Argument of type '"deleteUser"' is not assignable to parameter of type '"listUsers" | "createUser"'.

// A settings object with only numbers and strings gains nothing from `as const`;
// plain `satisfies AppConfig` (01-whatSatisfiesChecks.ts) is enough.
const appConfig = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
} as const satisfies AppConfig;

appConfig.retryCount; // type: 3
