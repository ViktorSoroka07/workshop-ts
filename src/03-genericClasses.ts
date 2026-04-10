export {};

// Just like interfaces (Repository<T> in 01-basics.ts), classes can have type parameters.
// The type flows through all methods and properties automatically — define it once
// on the class, and every method knows what T is.

// --- Cache<T>: in-memory cache with expiration ---

// You need a cache that stores values of a specific type with TTL.
// Without generics, you'd either use `any` or duplicate the class per type.
class Cache<T> {
  private store = new Map<string, { value: T; expiresAt: number }>();

  set(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get(key: string): T | undefined {  // return type uses the same T from the class
    const entry = this.store.get(key);
    // In production you'd add cleanup (e.g. delete on access or periodic sweep)
    if (!entry || entry.expiresAt < Date.now()) return undefined;
    return entry.value;
  }
}

interface User {
  id: number;
  name: string;
}

// One class, different caches for different types:
const userCache = new Cache<User>();
userCache.set('user:1', { id: 1, name: 'Alice' }, 60_000);
const cached = userCache.get('user:1'); // hover: User | undefined

const tokenCache = new Cache<string>();
tokenCache.set('session', 'abc123', 30_000);
const token = tokenCache.get('session'); // hover: string | undefined
