export {};

// --- Result<T, E>: success/error wrapper ---

// Instead of throwing, return a typed Result that forces callers to handle both cases.
// Inspired by Rust's Result type.

class Result<T, E = Error> {
  private constructor(
    private readonly value: T | null,
    private readonly error: E | null
  ) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result(value, null) as Result<T, never>;
  }

  static err<E>(error: E): Result<never, E> {
    return new Result(null, error) as Result<never, E>;
  }

  isOk(): boolean {
    return this.error === null;
  }

  // The return type uses the same T from the class — it propagates automatically
  unwrap(): T {
    if (this.value === null) throw new Error('Called unwrap on an error Result');
    return this.value;
  }

  unwrapErr(): E {
    if (this.error === null) throw new Error('Called unwrapErr on an ok Result');
    return this.error;
  }
}

function parseJson<T>(raw: string): Result<T, string> {
  try {
    return Result.ok(JSON.parse(raw) as T);
  } catch {
    return Result.err('Invalid JSON');
  }
}

interface User {
  id: number;
  name: string;
}

const good = parseJson<User>('{"id": 1, "name": "Alice"}');
if (good.isOk()) {
  console.log(good.unwrap().name); // hover on unwrap(): User
}

const bad = parseJson<User>('not json');
if (!bad.isOk()) {
  console.log(bad.unwrapErr()); // hover: string
}

// --- TypedEventEmitter<Events>: typed event system ---

// The Events type parameter is a map of event name → payload type.
// This ensures emit() and on() agree on what data each event carries.
class TypedEventEmitter<Events> {
  private listeners = {} as {
    [K in keyof Events]?: Array<(payload: Events[K]) => void>;
  };

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    const handlers = (this.listeners[event] ??= []);
    handlers.push(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.listeners[event]?.forEach((handler) => handler(payload));
  }
}

// Define the event map for a shopping cart:
interface CartEvents {
  itemAdded: { productId: number; quantity: number };
  itemRemoved: { productId: number };
  checkout: { total: number; currency: string };
}

const cart = new TypedEventEmitter<CartEvents>();

cart.on('itemAdded', (payload) => {
  console.log(`Added ${payload.quantity}x product #${payload.productId}`);
  // payload is typed as { productId: number; quantity: number }
});

cart.on('checkout', (payload) => {
  console.log(`Checkout: ${payload.total} ${payload.currency}`);
});

cart.emit('itemAdded', { productId: 42, quantity: 2 }); // OK
cart.emit('checkout', { total: 99.99, currency: 'USD' }); // OK

// @ts-expect-error — 'cancelled' is not a known event
cart.emit('cancelled', {});

// @ts-expect-error — wrong payload shape for 'checkout'
cart.emit('checkout', { amount: 50 });
