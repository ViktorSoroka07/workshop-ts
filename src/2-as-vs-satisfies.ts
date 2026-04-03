import { Config } from './Config';

// The `satisfies` operator is useful when you want type safety with less casting risk compared to using `as`

// `as` operator behavior

// 1. allows extra properties

const configAs1 = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  debugMode: true, // ✅ No error (extra property)
} as Config;

// 2. it sets the for variables it is applied on - `config` variable has `Config` type now

// 3. allows not all required properties
const configAs2 = {
  apiUrl: { host: '/api', port: 8080 },
} as Config;
const configAs3 = {} as Config;

// ❌ Error (this will break at runtime because `apiUrl` is undefined)
console.log(configAs3.apiUrl.host);

// it still might be what is needed if we need to define the config beforehand and later add properties to it, but still it

configAs3.apiUrl.host = 'host';
configAs3.apiUrl.port = 8080;

console.log(configAs3.apiUrl.host);

// but still this is not the best experience as we might forget to do that and TypeScript won't help us

// 4. does not allow incorrect type for defined config properties (e.g. using number where string is expected `apiUrl: 8080`)

// Basically TypeScript trusts you and doesn't check that config matches the `Config` type exactly

// `satisfies` validates that config has the exact shape of `Config`. And still retains specific inference (`configSatisfies` keeps its original inferred type)

const configSatisfies = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  // @ts-expect-error
  debugMode: true, // ❌ Error (extra property)
} satisfies Config;
