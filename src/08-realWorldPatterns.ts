import { ValuesType } from 'utility-types';
import '@total-typescript/ts-reset';

// --- Type-safe API client ---

interface ApiResponse<T> {
  data: T;
  status: number;
  error: string | null;
}

// A single generic function handles any endpoint shape:
async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = (await response.json()) as T;
  return { data, status: response.status, error: null };
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;
  total: number;
  items: string[];
}

async function main() {
  const userRes = await apiGet<User>('/api/users/1');
  console.log(userRes.data.name); // TS knows data is User

  const orderRes = await apiGet<Order>('/api/orders/42');
  console.log(orderRes.data.total); // TS knows data is Order
}

// --- Type-safe config accessor ---

// `as const` preserves literal types, `keyof` + indexed access ensure
// getConfig returns the exact type for each key.
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

// Each method returns a new Builder with the accumulated type,
// so build() knows exactly what shape was configured.
class QueryBuilder<T extends Record<string, unknown> = {}> {
  private params: Record<string, unknown> = {};

  where<K extends string, V>(key: K, value: V): QueryBuilder<T & Record<K, V>> {
    this.params[key] = value;
    return this as unknown as QueryBuilder<T & Record<K, V>>;
  }

  build(): T {
    return this.params as T;
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

// Extracts a union of all value types from an object type:
const statusCodes = {
  ok: 200,
  created: 201,
  notFound: 404,
  serverError: 500,
} as const;

type StatusCode = ValuesType<typeof statusCodes>; // 200 | 201 | 404 | 500

// --- ts-reset: smarter array .filter(Boolean) ---

// Without ts-reset, filter(Boolean) returns (number | null | undefined)[].
// With ts-reset enabled (via reset.d.ts), it correctly narrows to number[].
const raw = [1, 2, null, undefined, 3];

const cleaned = raw.filter(Boolean); // number[] — thanks to ts-reset
