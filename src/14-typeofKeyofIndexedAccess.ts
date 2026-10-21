// =============================================================================
// 14. Utility Type Operators: typeof, keyof, Indexed Access
// =============================================================================

// Build up a realistic example step by step:

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
} as const;

// `typeof` extracts a type from a value:
type Config = typeof config;
// { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; readonly retries: 3 }

// `keyof` gets the union of keys:
type ConfigKey = keyof Config; // "apiUrl" | "timeout" | "retries"

// Indexed access gets value types:
type ConfigValue = Config[ConfigKey]; //  "https://api.example.com" | 5000 | 3
type Timeout = Config['timeout']; // 5000

// Extract element type from an array:
const endpoints = [
  { path: '/api/users', method: 'GET' as const, auth: true },
  { path: '/api/health', method: 'GET' as const, auth: false },
];

type Endpoint = (typeof endpoints)[number];
// { path: string; method: "GET"; auth: boolean }

type EndpointKey = keyof Endpoint; // "path" | "method" | "auth"

// Type-safe property accessor:
function getEndpointProp(endpoint: Endpoint, key: EndpointKey) {
  return endpoint[key];
}

getEndpointProp(endpoints[0], 'path'); // OK
// @ts-expect-error
getEndpointProp(endpoints[0], 'url'); // Error: '"url"' is not assignable to type 'EndpointKey'
