import { Config } from './Config';

// explicit type annotation behavior

// 1. does not allow extra properties comparing to `as`
const config: Config = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  // @ts-expect-error
  debugMode: true, // ❌ Error (extra property)
};

// 2. it sets the for variables it is applied on - `config` variable has `Config` type now. Another example of the same

// 3. If you declare a wider type than you want, you're stuck with the wider type

type Routes = Record<string, {}>;

const routes: Routes = {
  '/users': {},
  '/admin/users': {},
};

// and if we set some field to it

// ✅ No error (extra property)
routes.unknown;

// `satisfies` validates that config has the exact shape of `Config`. And still retains specific inference (`config1` keeps its original inferred type)

const config1 = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  // @ts-expect-error
  debugMode: true, // ❌ Error (extra property)
} satisfies Config;

const routes1 = {
  '/users': {},
  '/admin/users': {},
} satisfies Routes;

// @ts-expect-error
routes1.unknown; // ❌ Error (extra property)
