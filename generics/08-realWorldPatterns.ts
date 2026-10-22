import { ValuesType } from 'utility-types';

// --- Type-safe API client ---

// Without generics, every endpoint needs its own fetch wrapper or returns `any`.
// One generic function handles them all — the caller specifies the expected shape:

// Two type params: T for the success body, E for the error body (defaults to string).
// Different APIs return different error shapes — this lets the caller specify both.
type ApiResponse<T, E = string> =
  | { data: T; status: number; error: null }
  | { data: null; status: number; error: E };

async function apiGet<T, E = string>(url: string): Promise<ApiResponse<T, E>> {
  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    return { data: null, status: response.status, error: json as E };
  }

  return { data: json as T, status: response.status, error: null };
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiError {
  message: string;
  code: number;
}

async function main() {
  // Simple: error is just a string by default
  const userRes = await apiGet<User>('/api/users/1');

  // Typed error: caller knows what the error body looks like
  const orderRes = await apiGet<User, ApiError>('/api/users/1');

  if (orderRes.error) {
    console.log(orderRes.error.message); // hover: string — TS knows the error shape
  } else {
    console.log(orderRes.data.name); // hover: string — TS knows it's User
  }
}

// --- Type-safe config accessor ---

// You have a config object and want a helper that reads a key from it.
// With a plain function, config["timeout"] loses the exact value — you get
// `string | number | boolean`. With `as const` + generics, getConfig("timeout")
// returns the literal 5000, and typos in key names are caught at compile time.
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  debug: false,
} as const;

type Config = typeof config;
type ConfigKey = keyof Config;

function getConfig<K extends ConfigKey>(key: K): Config[K] {
  return config[key];
}

const timeout = getConfig('timeout'); // hover: 5000 (literal type, not just number)
const apiUrl = getConfig('apiUrl'); // hover: "https://api.example.com"
// @ts-expect-error — 'baseUrl' is not a valid config key
getConfig('baseUrl');

// --- Builder pattern ---

// Builders let you construct objects step by step. The challenge: how does TS
// know what shape you've built so far? Each .where() call returns a new Builder
// with an expanded type, so build() returns the exact shape you configured.
class QueryBuilder<T extends Record<string, unknown> = {}> {
  private params: Record<string, unknown> = {};

  where<K extends string, V>(key: K, value: V): QueryBuilder<T & Record<K, V>> {
    this.params[key] = value;
    // TS won't let you assert directly between unrelated types (QueryBuilder<T> → QueryBuilder<T & ...>).
    // Casting through `unknown` first removes all type info, then re-asserts to the new type.
    // Think of it as: "forget what this is → now treat it as this new type."
    return this as unknown as QueryBuilder<T & Record<K, V>>;
  }

  build(): T {
    return this.params as T; // TS only sees Record<string, unknown>, we assert it matches T
  }
}

const query = new QueryBuilder()
  .where('status', 'active' as const)
  .where('minPrice', 10)
  .where('inStock', true)
  .build();

// hover on query: { status: "active" } & { minPrice: number } & { inStock: boolean }
console.log(query.status); // hover: "active"
console.log(query.minPrice); // hover: number

// --- ValuesType from utility-types ---

// TS has `keyof` to get a union of keys, but no built-in for values.
// `ValuesType` from the `utility-types` library fills that gap:
const statusCodes = {
  ok: 200,
  created: 201,
  notFound: 404,
  serverError: 500,
} as const;

// Without the library, you'd write it manually using keyof + indexed access:
type StatusCodeManual = (typeof statusCodes)[keyof typeof statusCodes]; // 200 | 201 | 404 | 500

// ValuesType does the same thing but is more readable:
type StatusCode = ValuesType<typeof statusCodes>; // 200 | 201 | 404 | 500

// --- ts-reset: smarter array .filter(Boolean) ---

// A common frustration: .filter(Boolean) should remove nulls, but TS doesn't narrow
// the type — you still get (number | null | undefined)[]. The ts-reset library
// patches built-in types so filter(Boolean) correctly narrows to number[].
const raw = [1, 2, null, undefined, 3];

const cleaned = raw.filter(Boolean); // number[] — thanks to ts-reset
