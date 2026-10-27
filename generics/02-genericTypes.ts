// =============================================================================
// Generic Type Aliases, Interfaces and Classes
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types

// Functions are not the only thing that takes type parameters: aliases, interfaces and
// classes do too. A generic type is a template -- `ApiResponse<User>` fills it in.
// Unlike a function call, a type usually has no arguments to infer from, so you write the
// type argument yourself. You already use generic types -- `Array<string>`, `Promise<User>`,
// `Map<string, number>` -- and this lesson shows how to write one.

export {};

// --- Generic type aliases ---

// Every endpoint returns different data, but the wrapper (status, error) is always the same.
// Define the wrapper once and plug in the data type:
type ApiResponse<T> = {
  data: T;
  error: string | null;
  status: number;
};

type UserResponse = ApiResponse<{ id: number; name: string }>;
type ProductListResponse = ApiResponse<{ id: number; title: string }[]>;

const userResponse: UserResponse = {
  data: { id: 1, name: 'Alice' },
  error: null,
  status: 200,
};

const productsResponse: ProductListResponse = {
  // @ts-expect-error
  data: [{ id: 1, name: 'Keyboard' }], // Error: Object literal may only specify known properties, and 'name' does not exist in type '{ id: number; title: string; }'.
  error: null,
  status: 200,
};

// @ts-expect-error
const missingArgument: ApiResponse = userResponse; // Error: Generic type 'ApiResponse' requires 1 type argument(s).

// --- Default type arguments ---

// A parameter most callers fill in the same way gets a default (`= string`), so they can
// leave that type argument out. Pages are usually cursor-based with a string cursor:
interface Page<Item, Cursor = string> {
  items: Item[];
  cursor: Cursor;
  hasMore: boolean;
}

const tagPage: Page<string> = {
  items: ['typescript', 'generics'],
  cursor: 'abc123',
  hasMore: true,
}; // Cursor defaults to string

interface Order {
  id: number;
  total: number;
}

// Offset pagination is the exception, so its caller says so:
const orderPage: Page<Order, number> = {
  items: [{ id: 1001, total: 99.99 }],
  cursor: 40,
  hasMore: false,
}; // the default is overridden

// A default fills in only its own parameter; `Item` still has to be given:
// @ts-expect-error
const bareOrderPage: Page = orderPage; // Error: Generic type 'Page<Item, Cursor>' requires between 1 and 2 type arguments.

// ⚠️ Gotcha: parameters with a default must come last, like optional function parameters --
// `Page` with its parameters swapped is rejected:
// @ts-expect-error
type BrokenPage<Cursor = string, Item> = { items: Item[]; cursor: Cursor }; // Error: Required type parameters may not follow optional type parameters.

// --- Generic interfaces ---

// Apps have many entity types (users, articles, products) that all need the same
// storage operations. A generic interface states the contract once:
interface Repository<Entity> {
  getById(id: number): Entity | undefined;
  getAll(): Entity[];
  save(item: Entity): void;
}

interface Article {
  id: number;
  title: string;
}

// A class picks the type argument when it implements the interface (see ../classes/09-implements.ts):
class ArticleRepository implements Repository<Article> {
  private items: Article[] = [];

  getById(id: number) {
    return this.items.find((item) => item.id === id);
  }

  getAll() {
    return [...this.items];
  }

  save(item: Article) {
    this.items.push(item);
  }
}

const articles = new ArticleRepository();
articles.save({ id: 1, title: 'Generics 101' });

const found = articles.getById(1); // type: Article | undefined

// --- Generic classes ---

// A class declares its type parameter once, and every property and method can use it.
// Here: an in-memory cache that holds values of one type.
class Cache<Value> {
  private store = new Map<string, { value: Value; expiresAt: number }>();

  set(key: string, value: Value, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get(key: string): Value | undefined {
    const entry = this.store.get(key);

    if (!entry || entry.expiresAt < Date.now()) return undefined;

    return entry.value;
  }
}

// One class, a separate cache type per use:
const userCache = new Cache<{ id: number; name: string }>();

userCache.set('user:1', { id: 1, name: 'Alice' }, 60_000); // 60_000 ms = 1 minute

const cachedUser = userCache.get('user:1'); // type: { id: number; name: string; } | undefined

// @ts-expect-error
userCache.set('user:2', 'Bob', 60_000); // Error: Argument of type 'string' is not assignable to parameter of type '{ id: number; name: string; }'.

// ⚠️ Gotcha: a constructor with no arguments gives inference nothing to work with, so the
// type falls back to `unknown`:
const untypedCache = new Cache(); // type: Cache<unknown>

// A constructor that takes the value does allow inference:
class Box<Content> {
  constructor(public content: Content) {}
}

const sealedBox = new Box('invoice.pdf'); // type: Box<string>

console.log(sealedBox.content); // invoice.pdf
