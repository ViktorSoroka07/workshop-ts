// =============================================================================
// Generics in Real Projects
// =============================================================================

// Four patterns that show up in application code, each combining the earlier lessons.

// --- A typed API client ---

// Without generics every endpoint needs its own fetch wrapper or returns `any`. One generic
// function covers them all; the caller says what the body looks like. Two type parameters:
// `T` for the success body and `E` for the error body, which defaults to `string`
// (02-genericTypes.ts). Each branch of the union fixes `data` and `error` together:
type ApiResult<T, E = string> =
  | { data: T; status: number; error: null }
  | { data: null; status: number; error: E };

async function apiGet<T, E = string>(url: string): Promise<ApiResult<T, E>> {
  const response = await fetch(url);
  const json = await response.json(); // type: unknown -- thanks to ts-reset (09-tsReset.ts)

  if (!response.ok) {
    return { data: null, status: response.status, error: json as E };
  }

  return { data: json as T, status: response.status, error: null };
}

interface User {
  id: number;
  name: string;
}

interface ApiError {
  message: string;
  code: number;
}

async function showUser() {
  const result = await apiGet<User, ApiError>('/api/users/1');

  if (result.error !== null) {
    console.log(result.error.message); // `error` is an ApiError in this branch
  } else {
    console.log(result.data.name); // `data` is a User in this branch
  }
}

// ⚠️ Gotcha: `T` appears only in the return type, and `json as T` is an assertion. Nothing
// checks the response against `User`; a wrong type argument compiles and fails at runtime.
// Generic code can promise a type, only a runtime check (a validation library) can prove it.
const wrongType = () => apiGet<string>('/api/users/1'); // OK -- compiles, the server still sends a user

// --- A typed event emitter ---

// Each event has its own payload. An event map plus `K extends keyof Events` makes
// `on` and `emit` agree with each other (03-constraints.ts):
class Emitter<Events> {
  private handlers: { [K in keyof Events]?: ((payload: Events[K]) => void)[] } =
    {};

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    // `??=` assigns only when the left side is null or undefined: it creates the list on first use
    (this.handlers[event] ??= []).push(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.handlers[event]?.forEach((handler) => handler(payload));
  }
}

interface ShopEvents {
  orderPlaced: { orderId: string; total: number };
  userSignedOut: undefined;
}

const shop = new Emitter<ShopEvents>();

shop.on('orderPlaced', (order) =>
  console.log(`order ${order.orderId}: ${order.total}`)
); // `order` is inferred from the event name

shop.emit('orderPlaced', { orderId: 'A-17', total: 120 }); // order A-17: 120

// An event without a payload still needs the explicit `undefined`, the rough edge of this pattern:
shop.emit('userSignedOut', undefined); // OK

// @ts-expect-error
shop.emit('userSignedOut'); // Error: Expected 2 arguments, but got 1.

// @ts-expect-error
shop.emit('orderPlaced', { orderId: 'A-18' }); // Error: Argument of type '{ orderId: string; }' is not assignable to parameter of type '{ orderId: string; total: number; }'.

// @ts-expect-error
shop.emit('orderCancelled', undefined); // Error: Argument of type '"orderCancelled"' is not assignable to parameter of type 'keyof ShopEvents'.

// --- Values of an object, as a generic alias ---

// `keyof` gives the keys of a type; there is no built-in for the values:
const statusCodes = {
  ok: 200,
  created: 201,
  notFound: 404,
  serverError: 500,
} as const;

// By hand it is the `keyof` + indexed access combination from ../types/14-typeofKeyofIndexedAccess.ts:
type StatusCodeByHand = (typeof statusCodes)[keyof typeof statusCodes]; // type: 200 | 201 | 404 | 500

// A generic alias (02-genericTypes.ts) gives the combination a name that works for any object:
type ValuesOf<Obj> = Obj[keyof Obj];
type StatusCode = ValuesOf<typeof statusCodes>; // type: 200 | 201 | 404 | 500

// Libraries such as `utility-types` ship the same alias under the name `ValuesType`.

// 🎓 On your own: harder because each call returns a different type than it received,
// and the types accumulate across a chain.
// A builder: the type grows with every `.where()`, so `build()` returns exactly what was set.
// The default `{}` is deliberate: it starts the chain from "nothing set yet" and prints
// shorter than `Record<never, never>`.
class QueryBuilder<Query extends Record<string, unknown> = {}> {
  private params: Record<string, unknown> = {};

  where<K extends string, V>(
    key: K,
    value: V
  ): QueryBuilder<Query & Record<K, V>> {
    this.params[key] = value;

    // `as unknown as` is the double assertion of ../types/13-assertionsAndAsConst.ts: the
    // compiler cannot see that `this` is now the larger type, so we state it:
    return this as unknown as QueryBuilder<Query & Record<K, V>>;
  }

  build(): Query {
    return this.params as Query;
  }
}

const query = new QueryBuilder()
  .where('status', 'active' as const) // `V` is unconstrained, so without `as const` 'active' widens to string
  .where('minPrice', 10)
  .where('inStock', true)
  .build(); // type: Record<"status", "active"> & Record<"minPrice", number> & Record<"inStock", boolean>

console.log(query.status, query.minPrice, query.inStock); // active 10 true

// @ts-expect-error
query.maxPrice; // Error: Property 'maxPrice' does not exist on type 'Record<"status", "active"> & Record<"minPrice", number> & Record<"inStock", boolean>'.
